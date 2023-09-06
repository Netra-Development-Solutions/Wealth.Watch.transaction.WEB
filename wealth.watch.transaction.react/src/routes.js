import TransactionMainLayout from "./Layout";
import { Navigate } from "react-router-dom";

const routes = [
    {
        path: '/dashboard/transactions',
        element: <TransactionMainLayout />,
    },
    {
        path: '*',
        element: <Navigate to="/dashboard/transactions" />,
    }
];

export default routes;  