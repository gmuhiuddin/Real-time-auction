import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from '../views/Dashboard';
import Login from '../views/Login';
import PassResetPage from '../views/PassResetPage';
import Loader from '../views/Loader';
import Navbar from '../components/Navbar';
import { setUser, removeUser } from '../store/userSlice.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <NavbarLayout />,
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
        ]
    },
]);

function NavbarLayout() {

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

function Layout() {

    const [loader, setLoader] = useState(true);

    const authInfo = useSelector(res => res.userInfo.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {

                if (!authInfo.uid) {
                    const userInfo = await getUserData(user.uid);

                    dispatch(setUser({
                        uid: userInfo.id,
                        ...userInfo.data()
                    }));
                };

            } else {
                if (authInfo.uid) {
                    dispatch(removeUser());
                };
            };
        });
    }, []);

    useEffect(() => {
        if (authInfo.uid) {
            if (pathname == "/login" || pathname == "/forgotpasspage") {
                navigate('/');
                setLoader(false);
            } else {
                setLoader(false);
            };
        } else {
            if (pathname == "/") {
                navigate('/login');
                setLoader(false);
            } else {
                setLoader(false);
            };
        };
    }, [pathname, authInfo]);

    if (loader) return <Loader />;

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