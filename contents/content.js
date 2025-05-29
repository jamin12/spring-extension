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

// apiKey is the full identifier like "GET /path/to/api"
// apiId is the path part, e.g., "/path/to/api"
// method is the HTTP method, e.g., "GET"
function addIndicator(apiKey, apiId, method, status) {
    const menuItem = document.createElement('div');
    menuItem.style.display = 'flex';
    menuItem.style.justifyContent = 'space-between';
    menuItem.style.alignItems = 'center';
    menuItem.style.margin = '5px 0';
    menuItem.style.padding = '5px';
    menuItem.style.width = '100%';
    menuItem.style.textAlign = 'left';
    menuItem.style.backgroundColor = '#f9f9f9';
    menuItem.style.border = '1px solid #ddd';
    menuItem.style.borderRadius = '3px';

    const menuItemText = document.createElement('span');
    menuItemText.textContent = apiKey; // Display the full apiKey
    menuItemText.style.flexGrow = '1';
    menuItemText.style.cursor = 'pointer';
    menuItemText.setAttribute('data-api-key', apiKey); // Store the apiKey

    menuItemText.addEventListener('click', async (event) => {
        const clickedApiKey = event.currentTarget.getAttribute('data-api-key');
        console.log(`[Swagger Extension] Menu item clicked for apiKey: ${clickedApiKey}`);

        let targetOpBlock = null;
        const opBlocks = document.querySelectorAll('.opblock');
        for (const opBlock of opBlocks) {
            const pathEl = opBlock.querySelector('.opblock-summary-path') || opBlock.querySelector('.opblock-summary-path__deprecated');
            const methodEl = opBlock.querySelector('.opblock-summary-method');
            if (pathEl && methodEl) {
                const currentOpBlockPath = pathEl.textContent.trim();
                const currentOpBlockMethod = methodEl.textContent.trim();
                const currentOpBlockApiKey = `${currentOpBlockMethod} ${currentOpBlockPath}`;

                if (currentOpBlockApiKey === clickedApiKey) {
                    targetOpBlock = opBlock;
                    break;
                }
            }
        }

        if (targetOpBlock) {
            console.log(`[Swagger Extension] Found target .opblock for ${clickedApiKey}.`);
            const parentTagSection = targetOpBlock.closest('.opblock-tag-section'); 
            
            if (parentTagSection) {
                const tagHeader = parentTagSection.querySelector('.opblock-tag'); 
                
                if (tagHeader) {
                    if (targetOpBlock.offsetParent === null) { 
                        console.log(`[Swagger Extension] Parent tag for ${clickedApiKey} appears collapsed. Clicking header to expand.`);
                        tagHeader.click(); 
                        await new Promise(resolve => setTimeout(resolve, 200)); 
                    }
                } else {
                    console.warn(`[Swagger Extension] Could not find tag header (.opblock-tag) for opblock with key: ${clickedApiKey}`);
                }
            } else {
                console.warn(`[Swagger Extension] Could not find parent tag section (.opblock-tag-section) for opblock with key: ${clickedApiKey}`);
            }
            
            console.log(`[Swagger Extension] Scrolling to target .opblock for ${clickedApiKey}.`);
            targetOpBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } else {
            console.error(`[Swagger Extension] Could not find .opblock for apiKey: ${clickedApiKey}`);
        }
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
    // console.log('[Swagger Extension] compareAndHighlightChanges called.'); // Removed for brevity
    try {
        const apiURL = localStorage.getItem('apiURL');
        if (!apiURL) {
            console.error('[Swagger Extension] No API URL found in local storage inside compareAndHighlightChanges.');
            return;
        }

        const storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
        newAPIs = await fetchAPIData(apiURL); 

        menu.innerHTML = ''; 
        // console.log('[Swagger Extension] Populating side menu from API data.'); // Removed for brevity

        const allApiKeys = new Set([...Object.keys(newAPIs), ...Object.keys(storedAPIs)]);
        let menuAddCount = 0;

        allApiKeys.forEach(apiKey => {
            const newApiDetail = newAPIs[apiKey];
            const storedApiDetail = storedAPIs[apiKey];
            
            const parts = apiKey.match(/^(\S+)\s+(.*)$/);
            if (!parts || parts.length < 3) {
                console.warn(`[Swagger Extension] Could not parse apiKey for menu: ${apiKey}`);
                return; 
            }
            const method = parts[1];
            const apiId = parts[2]; 

            let status = null;

            if (newApiDetail && !storedApiDetail) {
                status = 'created';
            } else if (newApiDetail && storedApiDetail) {
                if (!deepEqual(newApiDetail, storedApiDetail)) { 
                    status = 'modified';
                }
            }

            if (status) {
                // console.log(`[Swagger Extension] Adding to menu: ${status} - ${apiKey}`); // Reduced verbosity
                addIndicator(apiKey, apiId, method, status); 
                menuAddCount++;
            }
        });
        
        if (menuAddCount > 0) {
            console.log(`[Swagger Extension] Added ${menuAddCount} items to the side menu.`);
        }

        const opBlocks = document.querySelectorAll('.opblock');
        // console.log(`[Swagger Extension] Found ${opBlocks.length} .opblock elements for DOM styling.`); // Removed for brevity
        if (opBlocks.length === 0 && allApiKeys.size > 0) { // Only warn if APIs were expected but no opblocks found
            console.warn('[Swagger Extension] No .opblock elements found for DOM styling, though API data exists.');
        }
        let styledOpBlockCount = 0;

        opBlocks.forEach((element) => { 
            const apiId_path_el = element.querySelector('.opblock-summary-path');
            let currentOpBlockApiId;
            if (apiId_path_el === null) {
                currentOpBlockApiId = element.querySelector('.opblock-summary-path__deprecated')?.textContent?.trim();
            } else {
                currentOpBlockApiId = apiId_path_el.textContent?.trim();
            }
            const currentOpBlockMethod = element.querySelector('.opblock-summary-method')?.textContent?.trim();

            if (!currentOpBlockApiId || !currentOpBlockMethod) {
                console.warn('[Swagger Extension] Could not determine apiId or method for an opblock for DOM styling:', element);
                return; 
            }
            
            const opBlockApiKey = `${currentOpBlockMethod} ${currentOpBlockApiId}`;

            if (newAPIs[opBlockApiKey]) {
                const newApiDetail = newAPIs[opBlockApiKey];
                const storedApiDetail = storedAPIs[opBlockApiKey];

                let needsStyling = false;
                if (storedApiDetail) {
                    if (!deepEqual(newApiDetail, storedApiDetail)) { 
                        needsStyling = true;
                    }
                } else { 
                    needsStyling = true;
                }

                if (needsStyling) {
                    element.style.border = '2px solid red';
                    addUpdateButton(element, opBlockApiKey, newApiDetail);
                    styledOpBlockCount++;
                }
            }
        });
        if (styledOpBlockCount > 0) {
            console.log(`[Swagger Extension] Styled ${styledOpBlockCount} opblocks with changes on the page.`);
        }

    } catch (error) {
        console.error('[Swagger Extension] Error in compareAndHighlightChanges:', error);
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
    const targetElement = event.target;
    const clickedTagHeader = targetElement.closest('.opblock-tag');

    if (clickedTagHeader) {
        console.log('[Swagger Extension] Tag expansion click detected, re-evaluating highlights.');
        setTimeout(() => {
            compareAndHighlightChanges();
        }, 100); 
    }
}

// MutationObserver를 사용하여 API 블록 로드를 감지
const observer = new MutationObserver((mutations, obs) => {
    const swaggerUiElement = document.getElementById('swagger-ui'); 
    if (swaggerUiElement && isSwaggerLoaded()) { 
        console.log("[Swagger Extension] Swagger UI detected by observer, running initial comparison.");
        compareAndHighlightChanges();

        if (!swaggerUiElement.hasAttribute('data-custom-click-listener')) {
            swaggerUiElement.addEventListener('click', handleSwaggerUiClick);
            swaggerUiElement.setAttribute('data-custom-click-listener', 'true');
            console.log("[Swagger Extension] Attaching click listener to #swagger-ui (via MutationObserver).");
        }
        obs.disconnect(); 
        console.log("[Swagger Extension] MutationObserver disconnected.");
    }
});

const config = { childList: true, subtree: true };
const targetNode = document.getElementById('swagger-ui');

if (targetNode) {
    // Initial check in case swagger is already fully loaded
    if (isSwaggerLoaded()) {
        console.log("[Swagger Extension] Swagger UI already loaded on initial script run. Performing initial comparison.");
        compareAndHighlightChanges();
        if (!targetNode.hasAttribute('data-custom-click-listener')) {
            targetNode.addEventListener('click', handleSwaggerUiClick);
            targetNode.setAttribute('data-custom-click-listener', 'true');
            console.log("[Swagger Extension] Attaching click listener to #swagger-ui (initial direct check).");
        }
    }
    observer.observe(targetNode, config);
    console.log("[Swagger Extension] MutationObserver is now observing #swagger-ui.");
} else {
    console.error('[Swagger Extension] Swagger UI root element (#swagger-ui) not found for observer setup at script load.');
}
