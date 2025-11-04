import {useEffect } from "react";
import { Link } from "react-router-dom";

import { productCartData } from "../../data/data";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function ShopCart(){

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);
    
    return(
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">Shop Cart</h5>

                    <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/">Techwind</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/shop">Shop</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold text-[var(--riafco-blue)] dark:text-white" aria-current="page">Cart</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 mt-6">
                    <div className="relative overflow-x-auto shadow-sm dark:shadow-gray-700 rounded-md">
                        <table className="w-full text-start">
                            <thead className="text-sm uppercase bg-white dark:bg-slate-900">
                                <tr>
                                    <th scope="col" className="p-4 w-4"></th>
                                    <th scope="col" className="text-start p-4 min-w-[220px]">Product</th>
                                    <th scope="col" className="p-4 w-24 min-w-[100px]">Price</th>
                                    <th scope="col" className="p-4 w-56 min-w-[220px]">Qty</th>
                                    <th scope="col" className="p-4 w-24 min-w-[100px]">Total($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productCartData.map((item,index) => {
                                    return(
                                        <tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800" key={index}>
                                            <td className="p-4"><Link to=""><i className="mdi mdi-window-close text-red-600"></i></Link></td>
                                            <td className="p-4">
                                                <span className="flex items-center">
                                                    <img src={item.image} className="rounded shadow-sm dark:shadow-gray-700 w-12" alt=""/>
                                                    <span className="ms-3">
                                                        <span className="block font-semibold">{item.name}</span>
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">$ {item.amount}</td>
                                            <td className="p-4 text-center">
                                                <div className="qty-icons space-x-1">
                                                    <button className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white minus">-</button>

                                                    <input min="0" name="quantity" defaultValue={item.qtn} type="number" className="h-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white pointer-events-none w-16 ps-4 quantity"/>

                                                    <button className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white plus">+</button>
                                                </div>
                                            </td>
                                            <td className="p-4  text-end">{item.amount * item.qtn}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                        <div className="lg:col-span-9 md:order-1 order-3">
                            <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md me-2 mt-2">Shop Now</Link>
                            <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white mt-2">Add to Cart</Link>
                        </div>

                        <div className="lg:col-span-3 md:order-2 order-1">
                            <ul className="list-none shadow-sm dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900">
                                <li className="flex justify-between p-4">
                                    <span className="font-semibold text-lg">Subtotal :</span>
                                    <span className="text-slate-400">$ 1500</span>
                                </li>
                                <li className="flex justify-between p-4 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-semibold text-lg">Taxes :</span>
                                    <span className="text-slate-400">$ 150</span>
                                </li>
                                <li className="flex justify-between font-semibold p-4 border-t border-gray-200 dark:border-gray-600">
                                    <span className="font-semibold text-lg">Total :</span>
                                    <span className="font-semibold">$ 1650</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}