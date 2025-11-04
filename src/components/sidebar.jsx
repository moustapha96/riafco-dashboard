/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";

// import LogoLight from '../assets/images/logo-icon-64.png'
import LogoLight from '../assets/images/logo-72x64.png'



import SimpleBarReact from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import { AiOutlineHistory, AiOutlineLineChart, AiOutlineUser } from "react-icons/ai";

import { MdOutlineEmail, MdOutlineEvent } from "react-icons/md";
import { } from "react-icons/lia";
import { BiNews } from "react-icons/bi";
import { RiSettings4Line } from "react-icons/ri";
import {  FaRegHandshake, FaRegImages } from "react-icons/fa";
import { MapPin } from "react-feather";

export default function Sidebar(){
    let [ manu, setmanu ] = useState('');
    let [ subManu, setSubManu ] = useState('');

    let location = useLocation();
    let current = location.pathname

    useEffect(()=>{
        setSubManu(current);
        setmanu(current)
        window.scrollTo(0,0)
    },[current])

   

    return(
        <nav className="sidebar-wrapper sidebar-dark">
            <div className=" sidebar-content">
                <div className="sidebar-brand">
                    <Link to="/"><img src={LogoLight} height="24" alt=""/></Link>
                </div>
                <SimpleBarReact style={{height:"calc(100% - 70px)"}}> 
                    
                    <ul className="sidebar-menu border-t border-white/10">

                        <li className={manu === "/" ? "active" : ""}>
                            <Link to="/"><div className="icon me-3"><AiOutlineLineChart /></div>Dashboard</Link>
                        </li>

                        <li className={`sidebar-dropdown ${["/admin/users", "/admin/team-members", "/admin/member-countries"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "users-item" ? "" : "users-item") }}>
                                <div className="icon me-3"><AiOutlineUser /></div>Utilisateurs
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/users", "/admin/team-members", "/admin/member-countries", "users-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/users" ? "active" : ""}`}><Link to="/admin/users">Liste des utilisateurs</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/team-members" ? "active" : ""}`}><Link to="/admin/team-members">Membres de l'équipe</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/ifcl" ? "active" : ""}`}><Link to="/admin/ifcl">Pays membres</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li className={manu === "/admin/ifcl/maps" ? "active" : ""}>
                            <Link to="/admin/ifcl/maps"><div className="icon me-3"><MapPin /></div>Carte</Link>
                        </li>

                        <li className={`sidebar-dropdown ${["/admin/activities"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "activities-item" ? "" : "activities-item") }}>
                                <div className="icon me-3"><AiOutlineHistory /></div>Activités
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/activities", "activities-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/activities" ? "active" : ""}`}><Link to="/admin/activities">Activités</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li className={`sidebar-dropdown ${["/admin/events", "/admin/calendar"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "events-item" ? "" : "events-item") }}>
                                <div className="icon me-3"><MdOutlineEvent /></div>Événements
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/events", "/admin/calendar", "events-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/events" ? "active" : ""}`}><Link to="/admin/events">Liste des événements</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/calendar" ? "active" : ""}`}><Link to="/admin/calendar">Calendrier</Link></li>
                                </ul>
                            </div>
                        </li>

                        
                        <li className={`sidebar-dropdown ${["/admin/news"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "news-item" ? "" : "news-item") }}>
                                <div className="icon me-3"><BiNews /></div>Actualités
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/news", "/admin/campaigns", "/admin/newsletter", "news-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/news" ? "active" : ""}`}><Link to="/admin/news">Actualités</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/campaigns" ? "active" : ""}`}><Link to="/admin/campaigns">Campagnes</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/newsletter" ? "active" : ""}`}><Link to="/admin/newsletter">Abonnés</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li className={manu === "/admin/resources" ? "active" : ""}>
                            <Link to="/admin/resources"><div className="icon me-3"><FaRegImages /></div>Ressources</Link>
                        </li>

                        <li className={manu === "/admin/partners" ? "active" : ""}>
                            <Link to="/admin/partners"><div className="icon me-3"><FaRegHandshake /></div>Partenaires</Link>
                        </li>

                        
                        <li className={`sidebar-dropdown ${["/admin/contacts", ].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "social-item" ? "" : "social-item") }}>
                                <div className="icon me-3"><MdOutlineEmail /></div>Contacts
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/contacts",  "social-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/contacts" ? "active" : ""}`}><Link to="/admin/contacts">Contacts</Link></li>
                                </ul>
                            </div>
                        </li>

                        
                        <li className={`sidebar-dropdown ${[ "/themes", "/discussions"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "theme-item" ? "" : "theme-item") }}>
                                <div className="icon me-3"><RiSettings4Line /></div>Thèmes
                            </Link>
                            <div className={`sidebar-submenu ${["/themes", "/discussions", "theme-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/themes" ? "active" : ""}`}><Link to="/themes">Thèmes</Link></li>
                                    <li className={`ms-0 ${manu === "/discussions" ? "active" : ""}`}><Link to="/discussions">Discussions</Link></li>
                                </ul>
                            </div>
                        </li>


                        <li className={`sidebar-dropdown ${["/admin/settings",  "/admin/mailer", "/admin/legal", "/admin/mention-legal", "/admin/audit-logs",  "/admin/historiques", "/admin/about-us", "/admin/gouvernance-reports"].includes(manu) ? "active" : ""}`}>
                            <Link to="#" onClick={() => { setSubManu(subManu === "settings-item" ? "" : "settings-item") }}>
                                <div className="icon me-3"><RiSettings4Line /></div>Paramètres
                            </Link>
                            <div className={`sidebar-submenu ${["/admin/settings", "/themes", "/admin/audit-logs", "/admin/mention-legal",
                               "/admin/mailer" ,"/admin/historiques", "/admin/about-us", "/admin/gouvernance-reports", "settings-item"].includes(subManu) ? "block" : ""}`}>
                                <ul>
                                    <li className={`ms-0 ${manu === "/admin/settings" ? "active" : ""}`}><Link to="/admin/settings">Paramètres généraux</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/mention-legal" ? "active" : ""}`}><Link to="/admin/mention-legal">Mentions légales</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/about-us" ? "active" : ""}`}><Link to="/admin/about-us">A propos</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/historiques" ? "active" : ""}`}><Link to="/admin/historiques">Historiqe</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/gouvernance-reports" ? "active" : ""}`}><Link to="/admin/gouvernance-reports">Rapport de gouvernance</Link></li>
                                    {/* /admin/audit-logs */}
                                    <li className={`ms-0 ${manu === "/admin/mailer" ? "active" : ""}`}><Link to="/admin/mailer">Mailer</Link></li>
                                    <li className={`ms-0 ${manu === "/admin/audit-logs" ? "active" : ""}`}><Link to="/admin/audit-logs">Audit logs</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li className={manu === "/profile" ? "active" : ""}>
                            <Link to="/profile"><div className="icon me-3"><AiOutlineUser /></div>Profil</Link>
                        </li>
                        
                    </ul>
                </SimpleBarReact>
            </div>
        </nav>
        
    )
}