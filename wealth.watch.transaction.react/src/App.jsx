import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import TransactionForm from "./components/forms/AddTransaction";
import TransactionList from "./components/lists/AllTransaction";
import routes from "./routes";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(routes)

function App() {
    return (
        <RouterProvider router={router} />
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
