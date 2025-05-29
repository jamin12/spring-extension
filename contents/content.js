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
modal.style.maxWidth = '95%'; // 모달 최대 너비
modal.style.width = '40%'; // 모달 너비
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
    
    const diffOutput = highlightJsonDifferences(currentAPI, previousAPI, 0); // currentAPI is obj1, previousAPI is obj2
    
    const diffModalContent = `
        <div style="display: flex; flex-direction: column; max-width: 100%; height: 100%; /* Ensure modal takes height */">
            <div style="padding: 10px; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; overflow-y: auto; flex-grow: 1; /* Allow content to scroll */">
                <h3 style="text-align: center; margin-bottom: 10px; position: sticky; top: 0; background: white; z-index: 1;">API 변경 사항 (현재 API 기준)</h3>
                <pre style="white-space: pre-wrap; word-wrap: break-word;">{
${diffOutput}
}</pre>
            </div>
        </div>
    `;
    return diffModalContent;
}

// obj1 is currentAPI, obj2 is previousAPI
function highlightJsonDifferences(obj1, obj2, indentLevel = 0) {
    let diffLines = [];
    const indent = "  ".repeat(indentLevel); // Base indent for the object's braces
    const childIndent = "  ".repeat(indentLevel + 1); // Indent for key-value lines

    // Handle cases where obj1 or obj2 might be undefined (e.g. a whole object added/deleted in recursive calls)
    const currentObj = obj1 || {}; 
    const previousObj = obj2 || {};

    const currentKeys = new Set(Object.keys(currentObj));
    const previousKeys = new Set(Object.keys(previousObj));
    const allKeys = new Set([...currentKeys, ...previousKeys]);

    allKeys.forEach(key => {
        if (key === "responses") {
            return; // Skip processing for the "responses" key
        }
        const currentValue = currentObj[key];
        const previousValue = previousObj[key];
        const currentExists = currentKeys.has(key);
        const previousExists = previousKeys.has(key);

        let keyString = `${childIndent}"${key}": `;
        let valueOutput; // String representation of the value, possibly with recursive diff
        let lineStyle = "";    // Style for the entire line if value is primitive and changed, or key is added/deleted
        let keySpecificStyle = ""; // Style for the key itself if its corresponding value is an object that's modified

        if (currentExists && !previousExists) { // ADDED to current
            lineStyle = "background-color: #ddffdd;"; // Green
            if (typeof currentValue === 'object' && currentValue !== null) {
                valueOutput = `{\n${highlightJsonDifferences(currentValue, undefined, indentLevel + 1)}\n${childIndent}}`;
                diffLines.push(`<span style="${lineStyle}">${keyString}${valueOutput}</span>`);
            } else {
                valueOutput = JSON.stringify(currentValue);
                // For added primitive values, the style should be on the value itself, not the whole line.
                // However, the provided example structure highlights the whole line for added/deleted keys.
                // To match the example, we'll highlight the line.
                diffLines.push(`<span style="${lineStyle}">${keyString}${valueOutput}</span>`);
            }
        } else if (!currentExists && previousExists) { // DELETED from current (was in previous)
            lineStyle = "background-color: #ffdddd; text-decoration: line-through;"; // Red, strikethrough
            if (typeof previousValue === 'object' && previousValue !== null) {
                // For deleted objects, pass 'undefined' as currentObj to guide recursion
                valueOutput = `{\n${highlightJsonDifferences(undefined, previousValue, indentLevel + 1)}\n${childIndent}}`;
            } else {
                valueOutput = JSON.stringify(previousValue);
            }
            diffLines.push(`<span style="${lineStyle}">${keyString}${valueOutput}</span>`);
        } else if (!deepEqual(currentValue, previousValue)) { // MODIFIED
            // keySpecificStyle = "background-color: #ddffdd;"; // Green for key of modified/new value - REMOVED for object keys
            valueOutput = currentValue; 
            if (typeof valueOutput === 'object' && valueOutput !== null && typeof previousValue === 'object' && previousValue !== null) {
                // Object vs Object: Key itself should NOT be styled green.
                // Let recursion handle highlighting of inner changes.
                // keyString already includes the key and ": "
                diffLines.push(`${keyString}{\n${highlightJsonDifferences(currentValue, previousValue, indentLevel + 1)}\n${childIndent}}`);
            } else { 
                // Primitive value changed, or type changed (e.g., obj to string or vice-versa).
                // Style only the value part green.
                const valueStyle = "background-color: #ddffdd;";
                diffLines.push(`${keyString}<span style="${valueStyle}">${JSON.stringify(valueOutput)}</span>`);
            }
        } else { // UNCHANGED
            valueOutput = currentValue;
            if (typeof valueOutput === 'object' && valueOutput !== null) {
                diffLines.push(`${keyString}{\n${highlightJsonDifferences(valueOutput, previousValue, indentLevel + 1)}\n${childIndent}}`);
            } else {
                diffLines.push(`${keyString}${JSON.stringify(valueOutput)}`);
            }
        }
    });
    return diffLines.join(",\n");
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
function addIndicator(apiKey, apiId, method, status, tagName) {
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
    menuItemText.setAttribute('data-api-tag', tagName || ''); // Store the tag name

    menuItemText.addEventListener('click', async (event) => {
        const clickedApiKey = event.currentTarget.getAttribute('data-api-key');
        const apiTag = event.currentTarget.getAttribute('data-api-tag');

        if (!apiTag) {
            console.warn(`[Swagger Extension - UI] Missing data-api-tag for ${clickedApiKey}. Cannot reliably open tag.`);
            // Optional: Fallback to old method if needed, or just fail here. For now, let's log and proceed to opblock search.
            // If we proceed, it might work if the opblock is already visible.
        }

        let tagHeaderElement = null;
        let tagSectionElement = null;

        if (apiTag) {
            // Attempt to find the tag header using the data-tag attribute.
            tagHeaderElement = document.querySelector(`.opblock-tag[data-tag="${apiTag}"]`);
            
            if (tagHeaderElement) {
                tagSectionElement = tagHeaderElement.closest('.opblock-tag-section');

                const expandButton = tagHeaderElement.querySelector('button.expand-operation');
                
                if (expandButton && expandButton.getAttribute('aria-expanded') === 'false') {
                    expandButton.click();
                    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for DOM to update
                } else if (!expandButton && tagHeaderElement.getAttribute('data-is-open') === 'false') {
                    // Fallback if only data-is-open is available on the header itself and header is clickable
                    tagHeaderElement.click();
                    await new Promise(resolve => setTimeout(resolve, 200)); 
                } else {
                }
            } else {
                console.warn(`[Swagger Extension - UI] Could not find tagHeaderElement for tag: "${apiTag}" using selector .opblock-tag[data-tag="${apiTag}"]`);
            }
        } else {
        }

        // Now, find the target .opblock
        let targetOpBlock = null;
        const searchContext = tagSectionElement && tagSectionElement.querySelector('.operation-tag-content') 
                              ? tagSectionElement.querySelector('.operation-tag-content') 
                              : document; // Fallback to whole document

        const opBlocks = searchContext.querySelectorAll('.opblock');
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
            targetOpBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            console.error(`[Swagger Extension - UI] Could not find .opblock for apiKey: ${clickedApiKey} after attempting to expand tag (if applicable).`);
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
            
            const apiKeyForLookup = apiKey; 

            const previousAPI = globalStoredAPIs[apiKeyForLookup];
            const currentAPI = globalNewAPIs[apiKeyForLookup];


            const diffContent = generateDiffContent(previousAPI, currentAPI);
            showModal(diffContent);
        });

        menuItem.appendChild(diffButton); 
    }

    menu.appendChild(menuItem);
}

async function saveAPIToLocalStorage() {
    const apiURL = input.value.trim();
    if (!apiURL) {
        alert('네트워크창에서 api doc을 읽어오는 url을 등록해주세요');
        return;
    }

    localStorage.setItem('apiURL', apiURL); 

    try {
        const apiData = await fetchAPIData(apiURL);
        localStorage.setItem('apiData', JSON.stringify(apiData));
        alert('api정보가 저장되었습니다.');
    } catch (error) {
        console.error('[Swagger Extension - Save] Error saving API data to localStorage:', error);
        alert('네트워크창에서 api doc을 읽어오는 url을 등록해주세요');
    }
}

async function fetchAPIData(apiURL) {
    try {
        const response = await fetch(apiURL);

        if (response) {
        } else {
            console.error('[Swagger Extension - Fetch] fetchAPIData: Fetch call resolved but response object is null/undefined.');
            throw new Error('Fetch call resolved but response object is null/undefined.');
        }

        if (!response.ok) {
            console.error(`[Swagger Extension - Fetch] fetchAPIData: Network response was not ok for URL ${apiURL}. Status: ${response.status} ${response.statusText}`);
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }

        let apiDoc;
        try {
            apiDoc = await response.json();
        } catch (jsonError) {
            console.error(`[Swagger Extension - Fetch] fetchAPIData: Error parsing JSON from URL ${apiURL}:`, jsonError);
            try {
                const textResponse = await response.text(); 
                console.error(`[Swagger Extension - Fetch] fetchAPIData: Non-JSON response text (first 500 chars):`, textResponse.substring(0, 500));
            } catch (textError) {
                console.error(`[Swagger Extension - Fetch] fetchAPIData: Error getting response.text() after JSON parse failure:`, textError);
            }
            throw jsonError; 
        }

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
            const apiTag = details.tags && details.tags.length > 0 ? details.tags[0] : null;

            apiData[`${method.toUpperCase()} ${path}`] = {
                method: method,
                path: path,
                tag: apiTag,
                queryParams: queryParams,
                bodyParams: bodyParams,
                responses: responses
            };
        }
    }
    return apiData;
} catch (error) {
    console.error(`[Swagger Extension - Fetch] fetchAPIData: Error fetching or processing API from URL ${apiURL}:`, error);
    throw error; 
}
}

function resolveRef(schema, apiDoc) {
    if (schema && schema.$ref) {
        const refPath = schema.$ref.replace(/^#\/components\/schemas\//, '');
        return apiDoc.components.schemas[refPath] || schema;
    }
    return schema;
}

let newAPIs = {} 
let globalNewAPIs = {}; 
let globalStoredAPIs = {}; 
let mainLogicInitialized = false; 

// --- START NEW/REVISED GLOBALS AND FUNCTIONS ---

function ensureClickListenerAttached() {
    const swaggerUiElement = document.getElementById('swagger-ui');
    if (swaggerUiElement && !swaggerUiElement.hasAttribute('data-custom-click-listener')) {
        swaggerUiElement.addEventListener('click', handleSwaggerUiClick);
        swaggerUiElement.setAttribute('data-custom-click-listener', 'true');
    } else if (swaggerUiElement && swaggerUiElement.hasAttribute('data-custom-click-listener')) {
        // Listener already attached
    } else if (!swaggerUiElement) {
        console.warn('[Swagger Extension - Lifecycle] ensureClickListenerAttached: #swagger-ui element not found. Cannot attach listener.');
    }
}

async function initialSetup() {
    if (mainLogicInitialized) {
        return;
    }
    mainLogicInitialized = true;
    
    await populateSideMenuFromData(); 
    ensureClickListenerAttached();    
    
    // >>> ADD DELAY AND LOGS HERE <<<
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
    
    compareAndHighlightChanges();     
    
}

// --- END NEW/REVISED GLOBALS AND FUNCTIONS ---


// --- START IMPLEMENTATION OF populateSideMenuFromData (assumed to be mostly correct from previous step) ---
async function populateSideMenuFromData() {
    try {
        let apiURL;
        try {
            apiURL = localStorage.getItem('apiURL');
            if (!apiURL) {
                console.error('[Swagger Extension - MenuInit] apiURL not found in localStorage. Cannot populate menu.');
                return;
            }
        } catch (e) {
            console.error('[Swagger Extension - Storage] populateSideMenuFromData: Error getting apiURL from localStorage:', e);
            return;
        }

        try {
            const storedData = localStorage.getItem('apiData') || '{}';
            globalStoredAPIs = JSON.parse(storedData);
        } catch (e) {
            console.error('[Swagger Extension - Storage] populateSideMenuFromData: Error parsing globalStoredAPIs from localStorage:', e);
            globalStoredAPIs = {}; 
        }

        try {
             globalNewAPIs = await fetchAPIData(apiURL); 
        } catch (fetchError) {
             console.error('[Swagger Extension - MenuInit] Error fetching new API data in populateSideMenuFromData:', fetchError);
             return; 
        }

        if (!menu || !document.body.contains(menu)) { 
            console.error('[Swagger Extension - MenuInit] Side menu DOM element (`menu`) not found or not in document. Cannot populate.');
            return;
        }
        menu.innerHTML = ''; 

        const allApiKeys = new Set([...Object.keys(globalNewAPIs), ...Object.keys(globalStoredAPIs)]);
        let itemsAddedToMenuCount = 0;

        allApiKeys.forEach(apiKey => {
            const newApiDetail = globalNewAPIs[apiKey];
            const storedApiDetail = globalStoredAPIs[apiKey];
            let status = null;
            const apiTag = newApiDetail ? newApiDetail.tag : null; 

            const parts = apiKey.match(/^(\S+)\s+(.*)$/);
            if (!parts || parts.length < 3) {
                console.warn(`[Swagger Extension - MenuInit] Could not parse apiKey for menu: ${apiKey}`);
                return; 
            }
            const method = parts[1];
            const apiId = parts[2]; 

            if (newApiDetail && !storedApiDetail) {
                status = 'created';
            } else if (newApiDetail && storedApiDetail) {
                if (!deepEqual(newApiDetail, storedApiDetail)) { 
                    status = 'modified';
                }
            } else if (!newApiDetail && storedApiDetail) {
                // status = 'deleted'; 
            }

            if (status) {
                itemsAddedToMenuCount++;
                addIndicator(apiKey, apiId, method, status, apiTag); 
            }
        });


    } catch (error) {
        console.error('[Swagger Extension - MenuInit] General error in populateSideMenuFromData:', error);
    }
}
// --- END IMPLEMENTATION OF populateSideMenuFromData ---


function compareAndHighlightChanges() { // Now synchronous

    if (!globalNewAPIs || Object.keys(globalNewAPIs).length === 0) {
        console.warn('[Swagger Extension - Styling] globalNewAPIs is not populated or empty. Skipping styling of .opblocks.');
        return;
    }

    const opBlocks = document.querySelectorAll('.opblock');
    let styledOpBlocksCount = 0;

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
            return; 
        }
        
        const opBlockApiKey = `${currentOpBlockMethod} ${currentOpBlockApiId}`;

        const newApiDetail = globalNewAPIs[opBlockApiKey];
        const storedApiDetail = globalStoredAPIs[opBlockApiKey]; 
        let needsStyling = false;

        if (newApiDetail) {
            if (storedApiDetail) { 
                if (!deepEqual(newApiDetail, storedApiDetail)) { 
                    needsStyling = true;
                }
            } else { 
                needsStyling = true;
            }

            if (needsStyling) {
                styledOpBlocksCount++;
                element.style.border = '2px solid red';
                addUpdateButton(element, opBlockApiKey, newApiDetail); 
            }
        } 
    });

    if (opBlocks.length > 0) { 
    } 
}


function addUpdateButton(element, apiKey, newAPI) {
    const existingButton = element.querySelector('.update-api-button');
    if (existingButton) {
        return; 
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
        element.style.border = ''; 
        updateButton.remove(); 
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
    const clickedTagHeader = event.target.closest('.opblock-tag');
    if (clickedTagHeader) {
        setTimeout(() => {
            compareAndHighlightChanges(); // Call the synchronous, styling-only version
        }, 200); 
    }
}


// --- START REVISED INITIALIZATION LOGIC ---

// MutationObserver: Simplified to only trigger initialSetup once #swagger-ui is found.
const observer = new MutationObserver(async (mutations, obs) => {
    const swaggerUiElement = document.getElementById('swagger-ui');
    if (swaggerUiElement) {
        obs.disconnect(); // Stop observing
        await initialSetup(); // Perform the one-time setup
    }
});

const config = { childList: true, subtree: true };

// Initial Script Execution Logic
const immediateSwaggerUi = document.getElementById('swagger-ui');
if (immediateSwaggerUi && !mainLogicInitialized) {
    initialSetup(); 
}

const targetNodeForObserver = document.getElementById('swagger-ui');
if (targetNodeForObserver) {
    observer.observe(targetNodeForObserver, config);
} else {
    console.warn('[Swagger Extension - Lifecycle] #swagger-ui not found at script start for observer. Using window.load fallback.');
    window.addEventListener('load', async () => {
        const swaggerUiOnLoad = document.getElementById('swagger-ui');
        if (swaggerUiOnLoad && !mainLogicInitialized) {
            await initialSetup();
        } else if (!swaggerUiOnLoad) {
            console.error('[Swagger Extension - Lifecycle] #swagger-ui still not found on window.load. Extension may not function.');
        } else if (mainLogicInitialized) {
        }
    });
}
