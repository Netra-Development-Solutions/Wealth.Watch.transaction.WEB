import TransactionForm from "./components/forms/AddTransaction";
import TransactionList from "./components/lists/AllTransaction";

const routes = [
    {
        path: '/',
        element: <div className="container">
        <TransactionForm />
        <TransactionList />
      </div>,
    },
    {
        path: '*',
        element: <>
            <h1>404</h1>
        </>
    }
];

export default routes;  