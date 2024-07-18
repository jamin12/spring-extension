// 페이지에 버튼 추가
const button = document.createElement('button');
button.textContent = 'Save API to Local Storage';
button.style.position = 'fixed';
button.style.top = '10px';
button.style.right = '10px';
button.style.zIndex = '1000';
button.style.padding = '10px 20px';
button.style.backgroundColor = '#4CAF50';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.addEventListener('click', saveAPIToLocalStorage);
document.body.appendChild(button);

// 페이지에 URL 입력 필드 추가
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter API URL';
input.style.position = 'fixed';
input.style.top = '50px';
input.style.right = '10px';
input.style.zIndex = '1000';
input.style.padding = '10px';
input.style.border = '1px solid #ccc';
input.style.borderRadius = '5px';
document.body.appendChild(input);

// 저장된 URL 로드
const savedURL = localStorage.getItem('apiURL');
if (savedURL) {
    input.value = savedURL;
}

// 좌측 상단에 메뉴 버튼 추가
const menuButton = document.createElement('button');
menuButton.textContent = '☰';
menuButton.style.position = 'fixed';
menuButton.style.top = '10px';
menuButton.style.left = '10px';
menuButton.style.zIndex = '1000';
menuButton.style.padding = '10px 20px';
menuButton.style.backgroundColor = '#4CAF50';
menuButton.style.color = 'white';
menuButton.style.border = 'none';
menuButton.style.borderRadius = '5px';
menuButton.style.cursor = 'pointer';
menuButton.addEventListener('click', toggleMenu);
document.body.appendChild(menuButton);

// 좌측 상단에 메뉴 생성
const menu = document.createElement('div');
menu.style.position = 'fixed';
menu.style.top = '50px';
menu.style.left = '10px';
menu.style.zIndex = '1000';
menu.style.padding = '10px';
menu.style.border = '1px solid #ccc';
menu.style.borderRadius = '5px';
menu.style.backgroundColor = 'white';
menu.style.display = 'none';
document.body.appendChild(menu);

function toggleMenu() {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// 인디케이터 컨테이너 생성
const indicatorContainer = document.createElement('div');
indicatorContainer.style.position = 'fixed';
indicatorContainer.style.top = '0';
indicatorContainer.style.right = '0';
indicatorContainer.style.width = '5px';
indicatorContainer.style.height = '100%';
indicatorContainer.style.zIndex = '999';
indicatorContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
document.body.appendChild(indicatorContainer);

async function saveAPIToLocalStorage() {
    const apiURL = input.value.trim();
    if (!apiURL) {
        alert('네트워크창에서 api doc을 읽어오는 url을 등록해주세요');
        return;
    }

    localStorage.setItem('apiURL', apiURL); // URL을 로컬 스토리지에 저장

    try {
        const apiData = await fetchAPIData(apiURL);
        localStorage.setItem('apiData', JSON.stringify(apiData));
        alert('api정보가 저장되었습니다.');
    } catch (error) {
        console.error('네트워크창에서 api doc을 읽어오는 url을 등록해주세요:', error);
        alert('네트워크창에서 api doc을 읽어오는 url을 등록해주세요');
    }
}

async function fetchAPIData(apiURL) {
    const response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const apiDoc = await response.json();

    const apiData = {};

    for (const [path, methods] of Object.entries(apiDoc.paths)) {
        for (const [method, details] of Object.entries(methods)) {
            const queryParams = details.parameters
                ? details.parameters.filter(param => param.in === 'query').map(param => param.name)
                : [];
            const bodyParams = details.requestBody &&
                details.requestBody.content &&
                details.requestBody.content['application/json'] &&
                details.requestBody.content['application/json'].schema
                ? resolveRef(details.requestBody.content['application/json'].schema, apiDoc)
                : null;
            const responses = details.responses
                ? Object.entries(details.responses).reduce((acc, [statusCode, response]) => {
                    acc[statusCode] = resolveRef(response.content?.['*/*']?.schema?.items ? response.content?.['*/*']?.schema?.items : response.content?.['*/*']?.schema, apiDoc);
                    return acc;
                }, {})
                : {};

            apiData[`${method.toUpperCase()} ${path}`] = {
                method: method,
                path: path,
                queryParams: queryParams,
                bodyParams: bodyParams,
                responses: responses
            };
        }
    }

    return apiData;
}

function resolveRef(schema, apiDoc) {
    if (schema && schema.$ref) {
        const refPath = schema.$ref.replace(/^#\/components\/schemas\//, '');
        return apiDoc.components.schemas[refPath] || schema;
    }
    return schema;
}

async function compareAndHighlightChanges() {
    try {
        const apiURL = localStorage.getItem('apiURL');
        if (!apiURL) {
            console.error('No API URL found in local storage.');
            return;
        }

        const storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
        const newAPIs = await fetchAPIData(apiURL);

        menu.innerHTML = ''; // 메뉴 초기화

        document.querySelectorAll('.opblock').forEach((element, index) => {
            const apiId_path = element.querySelector('.opblock-summary-path');
            let apiId;
            if (apiId_path === null) {
                apiId = element.querySelector('.opblock-summary-path__deprecated').textContent.trim()
            } else {
                apiId = apiId_path.textContent.trim()
            }
            const method = element.querySelector('.opblock-summary-method').textContent.trim();

            const apiKey = `${method} ${apiId}`;

            if (newAPIs[apiKey]) {
                const newQueryParams = newAPIs[apiKey].queryParams;
                const newBodyParams = newAPIs[apiKey].bodyParams;
                const newResponses = newAPIs[apiKey].responses;

                if (storedAPIs[apiKey]) {
                    const storedMethod = storedAPIs[apiKey].method;
                    const storedQueryParams = storedAPIs[apiKey].queryParams;
                    const storedBodyParams = storedAPIs[apiKey].bodyParams;
                    const storedResponses = storedAPIs[apiKey].responses;

                    if (
                        method.toUpperCase() !== storedMethod.toUpperCase() ||
                        !arraysEqual(newQueryParams, storedQueryParams) ||
                        !deepEqual(newBodyParams, storedBodyParams) ||
                        !deepEqual(newResponses, storedResponses)
                    ) {
                        element.style.border = '2px solid red'; // 변경된 API 항목에 빨간 테두리 적용
                        addIndicator(index, apiId, method); // 인디케이터 추가
                        addUpdateButton(element, apiKey, newAPIs[apiKey]); // 업데이트 버튼 추가
                    }
                } else {
                    element.style.border = '2px solid red'; // 새로운 API 항목에 빨간 테두리 적용
                    addIndicator(index, apiId, method); // 인디케이터 추가
                    addUpdateButton(element, apiKey, newAPIs[apiKey]); // 업데이트 버튼 추가
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch API document:', error);
    }
}

function addIndicator(index, apiId, method) {
    const menuItem = document.createElement('button');
    menuItem.textContent = `${method} ${apiId}`;
    menuItem.style.display = 'block';
    menuItem.style.margin = '5px 0';
    menuItem.style.padding = '5px';
    menuItem.style.width = '100%';
    menuItem.style.textAlign = 'left';
    menuItem.style.backgroundColor = '#f9f9f9';
    menuItem.style.border = '1px solid #ddd';
    menuItem.style.borderRadius = '3px';
    menuItem.style.cursor = 'pointer';
    menuItem.addEventListener('click', () => {
        document.querySelectorAll('.opblock')[index].scrollIntoView({ behavior: 'smooth' });
    });
    menu.appendChild(menuItem);
}

function addUpdateButton(element, apiKey, newAPI) {
    const existingButton = element.querySelector('.update-api-button');
    if (existingButton) {
        return; // 이미 버튼이 있는 경우 중복 추가하지 않음
    }

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update API';
    updateButton.className = 'update-api-button';
    updateButton.style.marginRight = '10px';
    updateButton.style.padding = '5px 10px';
    updateButton.style.backgroundColor = '#FF5733';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '3px';
    updateButton.style.cursor = 'pointer';
    updateButton.addEventListener('click', () => {
        let storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
        storedAPIs[apiKey] = newAPI;
        localStorage.setItem('apiData', JSON.stringify(storedAPIs));
        element.style.border = ''; // 빨간 테두리 제거
        updateButton.remove(); // 업데이트 버튼 제거
    });

    const summaryElement = element.querySelector('.opblock-summary');
    summaryElement.insertBefore(updateButton, summaryElement.firstChild);
}

// 배열 비교 함수
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 객체 비교 함수
function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Swagger 문서 로드 완료 확인 함수
function isSwaggerLoaded() {
    return document.querySelectorAll('.opblock').length > 0;
}

// MutationObserver를 사용하여 API 블록 로드를 감지
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            if (isSwaggerLoaded()) {
                compareAndHighlightChanges();
                observer.disconnect(); // Swagger 문서가 완성되면 관찰 중지
            }
        }
    });
});

const config = { childList: true, subtree: true };
const targetNode = document.getElementById('swagger-ui');
if (targetNode) {
    observer.observe(targetNode, config);
} else {
    console.error('Swagger UI root element not found.');
}
