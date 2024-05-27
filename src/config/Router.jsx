import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from '../views/Dashboard';
import Login from '../views/Login';
import PassResetPage from '../views/PassResetPage';
import Loader from '../views/Loader';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/forgotpasspage",
        element: <PassResetPage />
    },
]);

function Layout() {
    return (
        <>
            <Outlet />
        </>
    );
};

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
};

export default Router;