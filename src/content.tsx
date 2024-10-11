import App from "@/App";
import ReactDOM from "react-dom/client";

// 새로 주입할 DOM 요소를 생성
const rootElement = document.createElement("div");
rootElement.id = "my-extension-root";
document.body.appendChild(rootElement);

// React 컴포넌트를 DOM에 렌더링
const root = ReactDOM.createRoot(rootElement); // rootElement를 전달
root.render(<App />); // 컴포넌트 렌더링
