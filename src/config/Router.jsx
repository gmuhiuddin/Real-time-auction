import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate, useParams } from "react-router-dom";
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
                        path: "/add",
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
    const { productid : productId } = useParams();
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

            if(authInfo.verified){
                if(pathname == "/verify-user"){
                    navigate(-1);
                };
            }else{
                if (pathname == "/seller-dashboard" || pathname == "/add" || pathname == `/edit/${productId}` ) {
                    navigate('/verify-user');
                };
            };

            if (authInfo.authType == "seller") {
                if(pathname == "/" || pathname == `/detail/${productId}`){
                    navigate('/seller-dashboard');
                };
            }else{
                if(pathname == "/seller-dashboard" || pathname == `/edit/${productId}` || pathname == '/add'){
                    navigate('/');
                };
            };

        } else {
            
            if (pathname == "/seller-dashboard" || pathname == "/verify-user" || pathname == "/add") {
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