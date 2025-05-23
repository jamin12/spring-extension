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
menu.style.overflowY = 'auto';
menu.style.maxHeight = '400px'; // 필요에 따라 높이를 조정하세요.
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

// 모달 생성
const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.zIndex = '2000';
modal.style.padding = '20px';
modal.style.border = '1px solid #ccc';
modal.style.borderRadius = '5px';
modal.style.backgroundColor = 'white';
modal.style.maxWidth = '80%'; // 모달 최대 너비
modal.style.maxHeight = '80%'; // 모달 최대 높이
modal.style.overflowY = 'auto'; // 세로 스크롤 허용
modal.style.overflowX = 'auto'; // 가로 스크롤 허용
modal.style.display = 'none'; // 기본적으로 모달은 숨김
document.body.appendChild(modal);

// 모달 오버레이 생성
const modalOverlay = document.createElement('div');
modalOverlay.style.position = 'fixed';
modalOverlay.style.top = '0';
modalOverlay.style.left = '0';
modalOverlay.style.width = '100vw';
modalOverlay.style.height = '100vh';
modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 반투명한 검은 배경
modalOverlay.style.zIndex = '1999'; // 모달 아래에 위치하도록 설정
modalOverlay.style.display = 'none'; // 기본적으로 숨김
document.body.appendChild(modalOverlay);

// X 닫기 버튼 생성 및 스타일 설정
const closeModalButton = document.createElement('button');
closeModalButton.textContent = '✖';
closeModalButton.style.position = 'absolute';
closeModalButton.style.top = '10px';
closeModalButton.style.right = '10px';
closeModalButton.style.background = 'transparent';
closeModalButton.style.border = 'none';
closeModalButton.style.fontSize = '20px';
closeModalButton.style.cursor = 'pointer';
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
modal.appendChild(closeModalButton);

// ESC 키를 누르면 모달을 닫는 이벤트 리스너 추가
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { // ESC 키가 눌렸는지 확인
        modal.style.display = 'none'; // 모달 닫기
        modalOverlay.style.display = 'none'; // 모달과 오버레이를 함께 숨김
    }
});

// 모달 외부 클릭 시 모달 닫기
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none'; // 모달과 오버레이를 함께 숨김
        modal.style.display = 'none'; // 모달 닫기
    }
});

function generateDiffContent(previousAPI, currentAPI) {
    // JSON 데이터를 객체 단위로 비교하고 하이라이트 처리
    const diffContent = `
        <div style="display: flex; flex-direction: column; max-width: 100%; height: 100%;">
            <div style="display: flex; justify-content: space-between; padding: 20px; background-color: #fafafa; flex-grow: 1; gap: 20px;">
                <div style="flex: 1; padding: 10px; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; overflow-y: auto;">
                    <h3 style="text-align: center; margin-bottom: 10px;">이전 API</h3>
                    <pre>${highlightJsonDifferences(previousAPI, currentAPI)}</pre>
                </div>
                <div style="flex: 1; padding: 10px; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 5px; overflow-y: auto;">
                    <h3 style="text-align: center; margin-bottom: 10px;">현재 API</h3>
                    <pre>${highlightJsonDifferences(currentAPI, previousAPI)}</pre>
                </div>
            </div>
        </div>
    `;

    return diffContent;
}

function highlightJsonDifferences(obj1, obj2) {
    let result = '';

    // 객체를 순회하며 차이점 찾기
    for (const key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                // 중첩된 객체인 경우 재귀적으로 비교
                result += `"${key}": {\n${highlightJsonDifferences(obj1[key], obj2[key])}\n},\n`;
            } else if (obj1[key] !== obj2[key]) {
                // 값이 다를 경우 하이라이트 처리
                result += `<span style="background-color: #ffcccc;">"${key}": ${JSON.stringify(obj1[key])}</span>,\n`;
            } else {
                // 값이 같을 경우 그대로 출력
                result += `"${key}": ${JSON.stringify(obj1[key])},\n`;
            }
        }
    }

    return result;


}

function showModal(content) {
    modal.innerHTML = content; // 모달에 내용을 추가
    modal.appendChild(closeModalButton); // 닫기 버튼 다시 추가
    modalOverlay.style.display = 'block'; // 모달과 오버레이를 함께 표시
    modal.style.display = 'block';
}

function addIndicator(index, apiId, method, status) {
    const menuItem = document.createElement('div');
    menuItem.style.display = 'flex'; // Flexbox로 레이아웃 구성
    menuItem.style.justifyContent = 'space-between';
    menuItem.style.alignItems = 'center';
    menuItem.style.margin = '5px 0';
    menuItem.style.padding = '5px';
    menuItem.style.width = '100%';
    menuItem.style.textAlign = 'left';
    menuItem.style.backgroundColor = '#f9f9f9';
    menuItem.style.border = '1px solid #ddd';
    menuItem.style.borderRadius = '3px';

    // API 정보 텍스트
    const menuItemText = document.createElement('span');
    menuItemText.textContent = `${method} ${apiId}`;
    menuItemText.style.flexGrow = '1'; // 남은 공간을 차지하게 함
    menuItemText.style.cursor = 'pointer'; // 클릭 가능하게 설정

    menuItemText.addEventListener('click', () => {
        document.querySelectorAll('.opblock')[index].scrollIntoView({ behavior: 'smooth' });
    });

    menuItem.appendChild(menuItemText);

    if (status === 'created') {
        const statusText = document.createElement('span');
        statusText.textContent = '생성됨';
        statusText.style.color = 'green';
        menuItem.appendChild(statusText);
    } else if (status === 'modified') {
        const diffButton = document.createElement('button');
        diffButton.textContent = '차이점';
        diffButton.style.marginLeft = '10px';
        diffButton.style.padding = '3px 5px';
        diffButton.style.backgroundColor = '#FF5733';
        diffButton.style.color = 'white';
        diffButton.style.border = 'none';
        diffButton.style.borderRadius = '3px';
        diffButton.style.cursor = 'pointer';

        diffButton.addEventListener('click', (event) => {
            event.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
            const storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
            const previousAPI = storedAPIs[`${method} ${apiId}`];
            const currentAPI = newAPIs[`${method} ${apiId}`];

            const diffContent = generateDiffContent(previousAPI, currentAPI);
            showModal(diffContent);
        });

        menuItem.appendChild(diffButton); // 버튼을 오른쪽 끝에 추가
    }

    menu.appendChild(menuItem);
}

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

let newAPIs = {}

async function compareAndHighlightChanges() {
    try {
        const apiURL = localStorage.getItem('apiURL');
        if (!apiURL) {
            console.error('No API URL found in local storage.');
            return;
        }

        const storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
        newAPIs = await fetchAPIData(apiURL);

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
                        addIndicator(index, apiId, method, "modified"); // 인디케이터 추가
                        addUpdateButton(element, apiKey, newAPIs[apiKey]); // 업데이트 버튼 추가
                    }
                } else {
                    element.style.border = '2px solid red'; // 새로운 API 항목에 빨간 테두리 적용
                    addIndicator(index, apiId, method, "created"); // 인디케이터 추가
                    addUpdateButton(element, apiKey, newAPIs[apiKey]); // 업데이트 버튼 추가
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch API document:', error);
    }
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

// Function to handle clicks on Swagger UI for tag expansion
function handleSwaggerUiClick(event) {
    // Check if the click was on or inside a tag header
    const clickedTagHeader = event.target.closest('.opblock-tag');

    if (clickedTagHeader) {
        // If a tag header was clicked, it's likely an expand/collapse action.
        // Re-run the comparison logic after a short delay to allow the DOM to update.
        setTimeout(() => {
            console.log("Swagger tag clicked, re-applying highlights."); // For debugging
            compareAndHighlightChanges();
        }, 100); // Adjust delay if needed
    }
}

// MutationObserver를 사용하여 API 블록 로드를 감지
const observer = new MutationObserver((mutations, obs) => {
    const swaggerUiElement = document.getElementById('swagger-ui'); // Get it fresh
    if (swaggerUiElement && isSwaggerLoaded()) { // Check if still in document and swagger is ready
        console.log("Swagger UI detected by observer, running comparison.");
        compareAndHighlightChanges();

        if (!swaggerUiElement.hasAttribute('data-custom-click-listener')) {
            swaggerUiElement.addEventListener('click', handleSwaggerUiClick);
            swaggerUiElement.setAttribute('data-custom-click-listener', 'true');
            console.log("Tag click listener added via MutationObserver.");
        }
        obs.disconnect(); // Disconnect after setup
    }
});

const config = { childList: true, subtree: true };
const targetNode = document.getElementById('swagger-ui');

if (targetNode) {
    // Initial check in case swagger is already fully loaded
    if (isSwaggerLoaded()) {
        console.log("Swagger UI already loaded on initial check.");
        compareAndHighlightChanges();
        if (!targetNode.hasAttribute('data-custom-click-listener')) {
            targetNode.addEventListener('click', handleSwaggerUiClick);
            targetNode.setAttribute('data-custom-click-listener', 'true');
            console.log("Tag click listener added on initial load (no observer needed yet).");
        }
        // If listener is added here, the observer might not strictly need to run or disconnect.
        // However, keeping observer logic for robustness in case isSwaggerLoaded was initially false
        // but becomes true before observer fully processes.
    }
    observer.observe(targetNode, config);
} else {
    console.error('Swagger UI root element (#swagger-ui) not found for observer setup.');
    // Fallback for when swagger-ui is not immediately available.
    // A more robust solution might involve a global listener or retrying to find #swagger-ui.
    // For now, we rely on #swagger-ui being present for the observer to attach.
    // If #swagger-ui appears later, this script might need to be re-run or have a more dynamic setup.
}
