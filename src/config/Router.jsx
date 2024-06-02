import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from '../views/Dashboard';
import Login from '../views/Login';
import PassResetPage from '../views/PassResetPage';
import VerifyUser from '../views/VerifyUser';
import Loader from '../views/Loader';
import Navbar from '../components/Navbar';
import PlaceBidPage from '../views/PlaceBidPage';
import { setUser, removeUser } from '../store/userSlice.jsx';
import SellerDashboard from "../views/SellerDashboard";
import AddProduct from "../views/AddProduct";
import EditProduct from "../views/EditProduct";

const router = createBrowserRouter([
    {
        path: "*",
        element: <h1>404</h1>
    },
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
                    },
                    {
                        path: "/detail/:productid",
                        element: <PlaceBidPage />
                    },
                    {
                        path: "/seller-dashboard",
                        element: <SellerDashboard />
                    },
                    {
                        path: "/edit/:productid",
                        element: <EditProduct />
                    },
                    {
                        path: "/addproduct",
                        element: <AddProduct />
                    },
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
            {
                path: "/verify-user",
                element: <VerifyUser />
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
                
                // if (!authInfo?.uid) {
                    const userInfo = await getUserData(user.uid);

                    dispatch(setUser({
                        uid: userInfo.id,
                        ...userInfo.data(),
                        verified: user.emailVerified,
                        authType: authInfo.authType ? authInfo.authType : "buyer"
                    }));
                // };
                setLoader(false);

            } else {
                if (authInfo?.uid) {
                    dispatch(removeUser());
                };
                setLoader(false);
            };
        });
    }, []);
    
    useEffect(() => {
        if (authInfo?.uid) {
            if (pathname == "/login" || pathname == "/forgotpasspage") {
                navigate('/');
            };

            if(authInfo.verified && pathname == "/verify-user"){
                navigate(-1);
            };

            if (!authInfo.verified && pathname == "/seller-dashboard" || pathname == "/sell-product" ) {
                navigate('/verify-user');
            };
            
            if (authInfo.authType !== "seller" && pathname == "/seller-dashboard" || pathname == "/sell-product") {
                navigate('/');
            };
            
             if (authInfo.authType == "seller" && pathname == "/") {
                navigate('/seller-dashboard');
                console.log("A");
            };

        } else {
            if (pathname == "/seller-dashboard" || pathname == "/sell-product" || pathname == "/verify-user") {
                navigate('/login');
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