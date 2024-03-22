"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const App = () => {
    return (<div>
      <h1>Hello, Electron!</h1>
    </div>);
};
react_dom_1.default.render(<App />, document.getElementById('root'));
