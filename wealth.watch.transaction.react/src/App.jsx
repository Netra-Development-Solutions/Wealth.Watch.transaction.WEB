import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import TransactionForm from "./components/forms/AddTransaction";
import TransactionList from "./components/lists/AllTransaction";

const App = () => (
  <div className="container">
    <TransactionForm />
    <TransactionList />
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
