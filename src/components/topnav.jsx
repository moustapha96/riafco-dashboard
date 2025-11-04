/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";


import logoDark from '../assets/images/logo-icon-64-dark.png'
import logoLight from '../assets/images/logo-icon-64.png'
import smallLogo from '../assets/images/logo-icon-32.png'

import * as Icon from 'react-feather'

import { IoSettingsOutline } from 'react-icons/io5'

import 'simplebar-react/dist/simplebar.min.css';
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";

import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "../hooks/useAuth";
import { Avatar } from "antd";
import {
    UserOutlined
} from "@ant-design/icons"
import { LiaSignOutAltSolid } from "react-icons/lia";
export default function Topnav({ setToggle, toggle }) {

    let [notification, setNotification] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    console.log(user)

    const handleLogOut = async () => {
        try {
            await logout();
            navigate("/auth/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            navigate("/auth/login"); 
        }
    }



    useEffect(() => {

        const handleClickOutside = (event) => {
            if (
                notificationRef.current && !notificationRef.current.contains(event.target)
            ) {
                setNotification(false)
            }
            if (
                userMenuRef.current && !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleHandler = () => {
        setToggle(!toggle)
    }



    // Empêcher la propagation du clic pour les menus
    const stopPropagation = (e) => {
        e.stopPropagation()
    }

    return (
        <>
            <div className="top-header">
                <div className="header-bar flex justify-between">
                    <div className="flex items-center space-x-1">
                        <Link to="#" className="xl:hidden block me-2">
                            <img src={smallLogo} className="md:hidden block" alt="" />
                            <span className="md:block hidden">
                                <img src={logoDark} className="inline-block dark:hidden" alt="" />
                                <img src={logoLight} className="hidden dark:inline-block" alt="" />
                            </span>
                        </Link>

                        <Link id="close-sidebar" className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full" href="#">
                            <Icon.Menu className="size-4" onClick={toggleHandler} />
                        </Link>


                    </div>


                    <ul className="list-none mb-0 space-x-1">
                        {/* Notifications Dropdown */}
                        {/* <li className="dropdown inline-block relative" ref={notificationRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setNotification(!notification)
                                }}
                                className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
                                type="button"
                            >
                                <Icon.Bell className="size-4" />
                                <span className="absolute top-0 end-0 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full size-2 after:content-[''] after:absolute after:size-2 after:bg-red-600 after:top-0 after:end-0 after:rounded-full after:animate-ping"></span>
                            </button>

                            <div
                                className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${notification ? "" : "hidden"}`}
                                onClick={stopPropagation}
                            >
                                <span className="px-4 py-4 flex justify-between">
                                    <span className="font-semibold">Notifications</span>
                                    <span className="flex items-center justify-center bg-red-600/20 text-red-600 text-[10px] font-bold rounded-full w-5 max-h-5 ms-1">
                                        3
                                    </span>
                                </span>
                                <SimpleBarReact className="h-64">
                                    <ul className="py-2 text-start h-64 border-t border-gray-100 dark:border-gray-800">
                                        <li>
                                            <Link to="#!" className="block font-medium py-1.5 px-4">
                                                <div className="flex items-center">
                                                    <div className="size-10 rounded-md shadow-sm shadow-[var(--riafco-blue)]/10 dark:shadow-gray-700 bg-[var(--riafco-blue)]/10 dark:bg-slate-800 text-[var(--riafco-blue)] dark:text-white flex items-center justify-center">
                                                        <Icon.ShoppingCart className="size-4" />
                                                    </div>
                                                    <div className="ms-2">
                                                        <span className="text-[15px] font-semibold block">Order Complete</span>
                                                        <small className="text-slate-400">15 min ago</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </SimpleBarReact>
                            </div>
                        </li> */}

                        {/* User Profile Dropdown */}
                        <li className="dropdown inline-block relative" ref={userMenuRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowUserMenu(!showUserMenu)
                                }}
                                className="dropdown-toggle items-center flex"
                                type="button"
                            >
                                <span className="size-8 inline-flex items-center justify-center
                                 tracking-wide align-middle duration-500 text-[20px] text-center
                                  bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border
                                   border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full">
                                    <div className="round-full">
                                        <Avatar
                                            size={50}

                                            src={user?.profilePic}
                                            alt="riafco avatar"
                                            icon={<UserOutlined />}
                                            style={{
                                                cursor: "pointer",
                                                border: "4px solid rgba(255,255,255,0.3)",
                                                transition: "all 0.3s ease",
                                            }}
                                        />
                                    </div>
                                </span>



                                <span className="font-semibold text-[16px] ms-1 sm:inline-block hidden">
                                    {user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}
                                </span>
                            </button>

                            <div
                                className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-44 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${showUserMenu ? "" : "hidden"}`}
                                onClick={stopPropagation}
                            >


                                <ul className="py-2 text-start">
                                    <li>
                                        <Link to="/profile" className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-[var(--riafco-orange)] "><AiOutlineUser className="me-2" />Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/settings" className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-[var(--riafco-orange)] "><IoSettingsOutline className="me-1 w-5" /> Paramettres</Link>
                                    </li>
                                    <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                                    <li>
                                        <Link onClick={handleLogOut} className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-[var(--riafco-orange)] "><LiaSignOutAltSolid className="me-2 size-4" />Déconnexion</Link>
                                    </li>
                                </ul>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}