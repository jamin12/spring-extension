export function renderUI() {
    const button = document.createElement('button');
    button.textContent = 'Save API to Local Storage';
    button.id = 'saveButton';
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
    document.body.appendChild(button);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter API URL';
    input.id = 'apiURLInput';
    input.style.position = 'fixed';
    input.style.top = '50px';
    input.style.right = '10px';
    input.style.zIndex = '1000';
    input.style.padding = '10px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';
    document.body.appendChild(input);

    const savedURL = localStorage.getItem('apiURL');
    if (savedURL) {
        input.value = savedURL;
    }
}
