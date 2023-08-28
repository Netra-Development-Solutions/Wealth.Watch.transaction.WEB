import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import TransactionForm from "./components/forms/Transaction";

const App = () => (
  <div className="container">
    <div>Name: wealth.watch.transaction.react</div>
    <div>Framework: react</div>
    <div>Language: JavaScript</div>
    <div>CSS: Empty CSS</div>
    <TransactionForm />
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
