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
import { removeUser } from '../../store/userSlice.jsx';

function NavbarComponent() {

    const navigate = useNavigate();
    const user = useSelector(res => res.userInfo.user);
    const dispatch = useDispatch();
    
    const { username: userName, email: userEmail, userImg } = user;

    const hendleLogout = async () => {
        await logout();
        dispatch(removeUser());
    };

    // const handleScrollContactPage = () => {
    //     const halfwayPoint = document.documentElement.scrollHeight;

    //     window.scrollTo(0, halfwayPoint);
    // };

    const handleScrollHomePage = () => {
        window.scrollTo(0, 0);
    };

    return (
            <div className='navbar-container'>
                <Navbar fluid rounded>
                    <NavbarBrand href="/">
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white co-name"><span className='web-name'>C</span>ar <span className='web-name'>P</span>arking</span>
                    </NavbarBrand>
                    <div className="flex md:order-2">
                        {userEmail ?
                            <>
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
                        <NavbarLink disabled={true} active className="opt disabled-opt">About</NavbarLink>
                        <NavbarLink disabled={true} className="opt disabled-opt">Services</NavbarLink>
                        <NavbarLink disabled={true} active className="opt disabled-opt">Contact</NavbarLink>
                    </NavbarCollapse>
                </Navbar>
        </div>
    );
};

export default NavbarComponent;