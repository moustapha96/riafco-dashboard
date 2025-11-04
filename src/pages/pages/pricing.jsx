import {useState, useEffect} from "react";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Pricing(){

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);
    
    const [activeIndex, setActiveIndex] = useState(0)
    return(
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">Pricing Plans</h5>

                    <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/">Techwind</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdOutlineKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold text-[var(--riafco-blue)] dark:text-white" aria-current="page">Pricing</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 mt-6">
                    <ul className="inline-block w-fit mx-auto flex-wrap justify-center text-center p-2 bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 rounded-md" >
                        <li role="presentation" className="inline-block">
                            <button className={`${activeIndex === 0 ? 'bg-[var(--riafco-blue)] text-white hover:text-white' : ''} px-4 py-1 text-sm font-semibold rounded-md w-full hover:text-[var(--riafco-blue)] duration-500`} onClick={() => setActiveIndex(0)}>Monthly</button>
                        </li>
                        <li role="presentation" className="inline-block">
                            <button className={`${activeIndex === 1 ? 'bg-[var(--riafco-blue)] text-white hover:text-white' : ''} px-4 py-1 text-sm font-semibold rounded-md w-full hover:text-[var(--riafco-blue)] duration-500`} onClick={() => setActiveIndex(1)}>Yearly <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-md inline-block h-5 ms-1">Save 25%</span></button>
                        </li>
                    </ul>

                    <div>
                        {activeIndex === 0 ? 
                            <div className="">
                                <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-6 gap-6">
                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Free</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free month</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">0</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Month</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/><span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Signup Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Startup</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free 14 days</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">19</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Month</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Select Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="bg-yellow-500 text-white py-1.5 px-6 text-center text-lg font-semibold">Popular</div>
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Advanced</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free 7 days</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">39</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Month</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/><span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md w-full mt-6">Buy Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Enterprise</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free demo</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">99</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Month</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Buy Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div> :''
                        }
                        {activeIndex === 1 ? 
                            <div>
                                <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-6 gap-6">
                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Basic</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free month</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">49</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Year</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Signup Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Startup</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free 14 days</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">199</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Year</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Select Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="bg-yellow-500 text-white py-1.5 px-6 text-center text-lg font-semibold">Popular</div>
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Advanced</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free 7 days</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">399</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Year</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineClose className="text-slate-400 align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md w-full mt-6">Buy Now</Link>
                                        </div>
                                    </div>

                                    <div className="group relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 h-fit">
                                        <div className="p-6 text-center">
                                            <h6 className="font-bold text-2xl">Enterprise</h6>

                                            <p className="text-slate-400 mt-2">We offers a <span className="font-medium">free demo</span> of service for new customers.</p>

                                            <div className="flex justify-center mt-4">
                                                <span className="text-[var(--riafco-blue)] font-semibold self-end mb-1">$</span>
                                                <span className="text-5xl text-[var(--riafco-blue)] font-bold mb-0 mx-0.5">899</span>
                                                <span className="text-slate-400 font-semibold self-end mb-1">/Year</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                            <ul className="list-none text-slate-400">
                                                <li className="flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Full Access</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Source Files</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Free Appointments</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Enhanced Security</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 10 Active Users</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Up to 30 Project Integrations</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Accounting Module</span></li>
                                                <li className="mt-2 flex items-center"><AiOutlineCheckCircle className="text-emerald-600 text-[20px] align-middle me-2"/> <span>Network Platform</span></li>
                                            </ul>

                                            <Link to="#" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white rounded-md w-full mt-6">Buy Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}