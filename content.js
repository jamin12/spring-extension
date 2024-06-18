// content.js

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

async function saveAPIToLocalStorage() {
    try {
        const apiData = await fetchAPIData();
        localStorage.setItem('apiData', JSON.stringify(apiData));
        alert('API data has been saved to local storage.');
    } catch (error) {
        console.error('Failed to fetch API document:', error);
        alert('Failed to fetch API document.');
    }
}

async function fetchAPIData() {
    const response = await fetch('http://127.0.0.1:8080/v2/v3/api-docs');
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
        const storedAPIs = JSON.parse(localStorage.getItem('apiData') || '{}');
        const newAPIs = await fetchAPIData();

        document.querySelectorAll('.opblock').forEach((element) => {
            const apiId = element.querySelector('.opblock-summary-path').textContent.trim();
            const method = element.querySelector('.opblock-summary-method').textContent.trim().toUpperCase();
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
                    }
                } else {
                    element.style.border = '2px solid red'; // 새로운 API 항목에 빨간 테두리 적용
                }
            } else {
                element.style.border = '2px solid red'; // 삭제된 API 항목에 빨간 테두리 적용
            }
        });
    } catch (error) {
        console.error('Failed to fetch API document:', error);
    }
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
