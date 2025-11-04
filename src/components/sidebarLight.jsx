import { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";

import LogoLight from '../assets/images/logo-icon-64.png'
import LogoDark from '../assets/images/logo-icon-64-dark'
import ShreeIcon from '../assets/images/shree-276.png'

import SimpleBarReact from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import { AiOutlineAppstore, AiOutlineCamera, AiOutlineFile, AiOutlineLineChart, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { PiBrowsersBold } from "react-icons/pi";
import { TbBrandBlogger } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { BiLayer, BiLogOutCircle } from "react-icons/bi";

export default function SidebarLight(){
    const [manu , setManu] = useState('');
    const [subManu , setSubManu] = useState('');
    const location = useLocation();

    useEffect(()=>{
        var current = location.pathname
        setManu(current)
        setSubManu(current)
    },[])
    
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

    return(
        <nav className="sidebar-wrapper">
            <div className=" sidebar-content">
                <div className="sidebar-brand">
                    <Link to="/">
                        <img src={LogoDark} height="24" alt="" className="block dark:hidden"/>
                        <img src={LogoLight} height="24" alt="" className="hidden dark:block"/>
                    </Link>
                </div>
            <SimpleBarReact style={{height:"calc(100% - 70px)"}}> 
                <ul className="sidebar-menu border-t border-white/10">
                    <li className={`sidebar-dropdown ${["/" ,"/index-crypto","/index-ecommerce"].includes(manu)? "active" : ""}`}>
                            <Link to="#" onClick={()=>{setSubManu(subManu === "/dashboard-item" ? "" : "/dashboard-item")}}><div className="icon me-3"><AiOutlineLineChart/></div>Dashboard</Link>
                            <div className={`sidebar-submenu ${["/","/index-crypto","/dashboard-item","/index-ecommerce"].includes(subManu)? "block" : ""}`}>
                                <ul>
                                    <li className={manu === "/" ? "active" : ""}><Link to="/">Analytics</Link></li>
                                    <li className={`ms-0 ${manu === "/index-crypto" ? "active" : ""}`}><Link to="/index-crypto">Cryptocurrency </Link></li>
                                    <li className={manu === "/index-ecommerce" || "" ? "active" : ""}><Link to="/index-ecommerce">eCommerce </Link></li>
                                </ul>
                            </div>
                        </li>

                    <li className={`sidebar-dropdown ${["/index-dark","/index-rtl","/index-dark-rtl","/index-sidebar-light","/index-sidebar-colored"].includes(manu)? "active ms-0" : ""}`}>
                        <Link to="#"  onClick={()=>{setSubManu(subManu === "/index-item" ? "" : "/index-item")}}><div className="icon me-3"><PiBrowsersBold/></div>Layouts</Link>
                        <div className={`sidebar-submenu ${["/index-dark","/index-rtl","/index-dark-rtl","/index-sidebar-light","/index-sidebar-colored","/index-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/index-dark" ? "active" : ""}`}><Link to="/index-dark">Dark Dashboard</Link></li>
                                <li className={`ms-0 ${manu === "/index-rtl" ? "active" : ""}`}><Link to="/index-rtl">RTL Dashboard</Link></li>
                                <li className={`ms-0 ${manu === "/index-dark-rtl" ? "active" : ""}`}><Link to="/index-dark-rtl">Dark RTL Dashboard</Link></li>
                                <li className={`ms-0 ${manu === "/index-sidebar-light" ? "active" : ""}`}><Link to="/index-sidebar-light">Light Sidebar</Link></li>
                                <li className={`ms-0 ${manu === "/index-sidebar-colored" ? "active" : ""}`}><Link to="/index-sidebar-colored">Colored Sidebar</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/chat","/email","/calendar"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/app-item" ? "" : "/app-item")}}><div className="icon me-3"><AiOutlineAppstore/></div>Apps</Link>
                        <div className={`sidebar-submenu ${["chat","email","calendar","app-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/chat" ? "active" : ""}`}><Link to="/chat">Chat</Link></li>
                                <li className={`ms-0 ${manu === "/email" ? "active" : ""}`}><Link to="/email">Email</Link></li>
                                <li className={`ms-0 ${manu === "/calendar" ? "active" : ""}`}><Link to="/calendar">Calendar</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/profile","/profile-billing","/profile-payment","/profile-social","/profile-notification","/profile-setting"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/profile-item" ? "" : "/profile-item")}}><div className="icon me-3"><AiOutlineUser/></div>User Profile</Link>
                        <div className={`sidebar-submenu ${["/profile","/profile-billing","/profile-payment","/profile-social","/profile-notification","/profile-setting","/profile-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/profile" ? "active" : ""}`}><Link to="/profile">Profile</Link></li>
                                <li className={`ms-0 ${manu === "/profile-billing" ? "active" : ""}`}><Link to="/profile-billing">Billing Info</Link></li>
                                <li className={`ms-0 ${manu === "/profile-payment" ? "active" : ""}`}><Link to="/profile-payment">Payment</Link></li>
                                <li className={`ms-0 ${manu === "/profile-social" ? "active" : ""}`}><Link to="/profile-social">Social Profile</Link></li>
                                <li className={`ms-0 ${manu === "/profile-notification" ? "active" : ""}`}><Link to="/profile-notification">Notifications</Link></li>
                                <li className={`ms-0 ${manu === "/profile-setting" ? "active" : ""}`}><Link to="/profile-setting">Profile Settings</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/blog","/blog-detail"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/blog-item" ? "" : "/blog-item")}}><div className="icon me-3"><TbBrandBlogger/></div>Blog</Link>
                        <div  className={`sidebar-submenu ${["/blog","/blog-detail","/blog-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/blog" ? "active" : ""}`}><Link to="/blog">Blogs</Link></li>
                                <li className={`ms-0 ${manu === "/blog-detail" ? "active" : ""}`}><Link to="/blog-detail">Blog Detail</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/shop","/shop-item-detail", "/shop-cart", "/checkout"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/shop-item" ? "" : "/shop-item")}}><div className="icon me-3"><AiOutlineShoppingCart/></div>E-Commerce</Link>
                        <div className={`sidebar-submenu ${["/shop","/shop-item-detail", "/shop-cart", "/checkout","/shop-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/shop" ? "active" : ""}`}><Link to="/shop">Shop</Link></li>
                                <li className={`ms-0 ${manu === "/shop-item-detail" ? "active" : ""}`}><Link to="/shop-item-detail">Shop Detail</Link></li>
                                <li className={`ms-0 ${manu === "/shop-cart" ? "active" : ""}`}><Link to="/shop-cart">Shopcart</Link></li>
                                <li className={`ms-0 ${manu === "/checkout" ? "active" : ""}`}><Link to="/checkout">Checkout</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/gallery-one","/gallery-two"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/gallery-item" ? "" : "/gallery-item")}}><div className="icon me-3"><AiOutlineCamera/></div>Gallery</Link>
                        <div className={`sidebar-submenu ${["/gallery-one","/gallery-two","/gallery-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`${manu === "/gallery-one" ? "active" : ""}`}><Link to="/gallery-one">Gallary One</Link></li>
                                <li className={`${manu === "/gallery-two" ? "active" : ""}`}><Link to="/gallery-two">Gallery Two</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/starter","/faqs","/pricing","/team","/privacy","/terms"].includes(manu)? "active" : ""}`}>
                        <Link to="#"  onClick={()=>{setSubManu(subManu === "/page-item" ? "" : "/page-item")}}><div className="icon me-3"><AiOutlineFile/></div>Pages</Link>
                        <div className={`sidebar-submenu ${["/starter","/faqs","/pricing","/team","/privacy","/terms","/page-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/starter" ? "active" : ""}`}><Link to="/starter">Starter</Link></li>
                                <li className={`ms-0 ${manu === "/faqs" ? "active" : ""}`}><Link to="/faqs">FAQs</Link></li>
                                <li className={`ms-0 ${manu === "/pricing" ? "active" : ""}`}><Link to="/pricing">Pricing</Link></li>
                                <li className={`ms-0 ${manu === "/team" ? "active" : ""}`}><Link to="/team">Team</Link></li>
                                <li className={`ms-0 ${manu === "/privacy" ? "active" : ""}`}><Link to="/privacy">Privacy Policy</Link></li>
                                <li className={`ms-0 ${manu === "/terms" ? "active" : ""}`}><Link to="/terms">Term & Condition</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li  className={manu === "/ui-components" ? "active" : ""}>
                        <Link to="/ui-components"><div className="icon me-3"><AiOutlineLineChart/></div>UI Components</Link>
                    </li>

                    <li className={`sidebar-dropdown ${["/email-confirmation","/email-password-reset","/email-alert","/email-invoices"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/mail-item" ? "" : "/mail-item")}}><div className="icon me-3"><MdOutlineEmail/></div>Email Template</Link>
                        <div className={`sidebar-submenu ${["/email-confirmation","/email-password-reset","/email-alert","/email-invoices","/mail-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`${manu === "/email-confirmation" ? "active" : ""}`}><Link to="/email-confirmation">Confirmation</Link></li>
                                <li className={`${manu === "/email-password-reset" ? "active" : ""}`}><Link to="/email-password-reset">Reset Password</Link></li>
                                <li className={`${manu === "/email-alert" ? "active" : ""}`}><Link to="/email-alert">Alert</Link></li>
                                <li className={`${manu === "/email-invoices" ? "active" : ""}`}><Link to="/email-invoices">Invoice</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/invoice-list","/invoice"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/invoice-item" ? "" : "/invoice-item")}}><div className="icon me-3"><LiaFileInvoiceDollarSolid/></div>Invoice</Link>
                        <div className={`sidebar-submenu ${["/invoice-list","/invoice","/invoice-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`${manu === "/invoice-list" ? "active" : ""}`}><Link to="/invoice-list">Invoice List</Link></li>
                                <li className={`${manu === "/invoice" ? "active" : ""}`}><Link to="/invoice">Invoice Preview</Link></li>
                            </ul>
                        </div>
                    </li>

                        <li className={`sidebar-dropdown ${["/auth/login", "/auth/signup", "/auth/signup-success", "/auth/re-password", "/auth/lock-screen"].includes(manu) ? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/auth-item" ? "" : "/auth-item")}}><div className="icon me-3"><BiLogOutCircle/></div>Authentication</Link>
                            <div className={`sidebar-submenu ${["/auth/login", "/auth/signup", "/auth/signup-success", "/auth/re-password", "/auth/lock-screen", "/auth-item"].includes(subManu) ? "block" : ""}`}>
                            <ul>
                                    <li className={`ms-0 ${manu === "/auth/login" ? "active" : ""}`}><Link to="/auth/login">Login</Link></li>
                                    <li className={`ms-0 ${manu === "/auth/signup" ? "active" : ""}`}><Link to="/auth/signup">Signup</Link></li>
                                    <li className={`ms-0 ${manu === "/auth/signup-success" ? "active" : ""}`}><Link to="/auth/signup-success">Signup Success</Link></li>
                                    <li className={`ms-0 ${manu === "/auth/re-password" ? "active" : ""}`}><Link to="/auth/re-password">Reset Password</Link></li>
                                    <li className={`ms-0 ${manu === "/auth/lock-screen" ? "active" : ""}`}><Link to="/auth/lock-screen">Lockscreen</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={`sidebar-dropdown ${["/comingsoon","/maintenance","/error","/thankyou"].includes(manu)? "active" : ""}`}>
                        <Link to="#" onClick={()=>{setSubManu(subManu === "/special-page" ? "" : "/special-page")}}><div className="icon me-3"><BiLayer/></div>Miscellaneous</Link>
                        <div className={`sidebar-submenu ${["/comingsoon","/maintenance","/error","/thankyou", "/special-page"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={`ms-0 ${manu === "/comingsoon" ? "active" : ""}`}><Link to="/comingsoon">Comingsoon</Link></li>
                                <li className={`ms-0 ${manu === "/maintenance" ? "active" : ""}`}><Link to="/maintenance">Maintenance</Link></li>
                                <li className={`ms-0 ${manu === "/error" ? "active" : ""}`}><Link to="/error">Error</Link></li>
                                <li className={`ms-0 ${manu === "/thankyou" ? "active" : ""}`}><Link to="/thankyou">Thank You</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className="relative lg:m-8 m-6 px-8 py-10 rounded-lg bg-gradient-to-b to-transparent from-slate-800 text-center">
                        <span className="relative z-10">
                            <span className="text-xl font-bold h5 text-white">Upgrade to Pro</span>

                            <span className="text-slate-400 mt-3 mb-5 block">Get one month free and subscribe to pro</span>

                            <Link to="https://1.envato.market/techwind-react" target="_blank" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle transition duration-500 ease-in-out text-base text-center bg-gray-500/5 hover:bg-gray-500 border-gray-500/10 hover:border-gray-500 text-white rounded-md">Subscribe</Link>
                        </span>
            
                        <img src={ShreeIcon} className="absolute top-1/2 -translate-y-1/2 start-0 end-0 mx-auto text-center size-40 z-0 opacity-5" alt=""/>
                    </li>
                </ul>
            </SimpleBarReact>
            </div>
        </nav>
        
    )
}