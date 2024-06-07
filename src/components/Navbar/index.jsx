import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { logout } from '../../config/firebase.jsx';
import { removeUser, setUser } from '../../store/userSlice.jsx';

function NavbarComponent() {

    const user = useSelector(res => res.userInfo.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { username: userName, email: userEmail, userImg, authType } = user ? user : {
        username: "", email: "", userImg: ""
    };

    const hendleLogout = async () => {
        await logout();
        dispatch(removeUser());
    };

    const handleScrollHomePage = () => {
        window.scrollTo(0, 0);
        navigate('/')
    };

    const handleChangeSwitchSeller = () => {
        
        if(user.verified){
            navigate('/seller-dashboard');

            dispatch(setUser({
                ...user,
                authType: "seller"
            }));
        }else{
            navigate('/verify-user');
        };

    };

    const handleChangeSwitchBuyer = () => {
        dispatch(setUser({
            ...user,
            authType: "buyer"
        }));
        navigate('/');
    };
    
    return (
        <div className='navbar-container'>
            <Navbar fluid rounded>
                <NavbarBrand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white co-name"><span className='web-name'>A</span>uction <span className='web-name'>W</span>eb</span>
                </NavbarBrand>
                <div className="flex md:order-2">
                    {userEmail ?
                        <>
                            {authType != "seller" ? 
                                <h1 className='switch-selling-txt' onClick={handleChangeSwitchSeller}>Switch selling</h1>
                                :
                                <h1 className='switch-selling-txt' onClick={handleChangeSwitchBuyer}>Switch buying</h1>
                            }
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={
                                    <Avatar alt="User settings" img={userImg} rounded />
                                }
                            >
                                <DropdownHeader>
                                    <span className="block text-sm bgcbk">Name: {userName}</span>
                                    <span className="block truncate text-sm font-medium bgcbk">email: {userEmail}</span>
                                </DropdownHeader>
                                <DropdownDivider />
                                <DropdownItem onClick={hendleLogout} className='signout-btn-back'><span className='bgcbk'>Sign out</span></DropdownItem>
                            </Dropdown>
                        </>
                        :
                        <span onClick={() => navigate('/login')} className='login-txt'>Login</span>
                    }
                    <NavbarToggle />
                </div>
                <NavbarCollapse>
                    <NavbarLink onClick={handleScrollHomePage} className="opt" active>
                        Home
                    </NavbarLink>
                    <NavbarLink onClick={() => navigate('upcomming')} active className="opt">Up comming bids</NavbarLink>
                    <NavbarLink disabled={true} active className="opt disabled-opt">Contact</NavbarLink>
                </NavbarCollapse>
            </Navbar>
        </div>
    );
};

export default NavbarComponent;