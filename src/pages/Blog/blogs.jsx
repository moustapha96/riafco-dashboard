import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as Icon from 'react-feather'

import { blogData } from "../../data/data";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";


export default function Blogs(){

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);
    
    let [modal, setModal] = useState(false)
    let [uploadFile, setUpoadFile] = useState()

    function handleChange(event) {
        if(event.target.files && event.target.files.length !== 0){
            setUpoadFile(URL.createObjectURL(event.target.files[0]))
    }
}
    
    return(
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <div>
                        <h5 className="text-lg font-semibold">Blogs / News</h5>

                        <ul className="tracking-[0.5px] inline-flex items-center mt-2">
                            <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/">Techwind</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                            <li className="inline-block capitalize text-[14px] font-bold text-[var(--riafco-blue)] dark:text-white" aria-current="page">Blogs</li>
                        </ul>
                    </div>

                    <div>
                        <Link to="#" onClick={() => setModal(!modal)} className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-800/5 hover:bg-gray-800/10 dark:bg-gray-800 border border-gray-800 dark:border-gray-700/5 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"><Icon.Plus className="size-4"/></Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 mt-6 gap-6">
                    {blogData.map((item,index)=>{
                        return(
                        <div className="relative rounded-md shadow-sm dark:shadow-gray-700 overflow-hidden bg-white dark:bg-slate-900" key={index}>
                            <img src={item.image} alt=""/>

                            <div className="content p-6">
                                <Link to={`/blog-detail/${item.id}`} className="title h5 text-lg font-medium hover:text-[var(--riafco-blue)] duration-500">{item.title}</Link>
                                <p className="text-slate-400 mt-3">{item.desc}</p>
                                
                                <div className="mt-4">
                                    <Link to={`/blog-detail/${item.id}`} className="relative inline-flex items-center tracking-wide align-middle text-base text-center border-none after:content-[''] after:absolute after:h-px after:w-0 hover:after:w-full after:end-0 hover:after:end-auto after:bottom-0 after:start-0 after:duration-500 font-normal hover:text-[var(--riafco-blue)] after:bg-[var(--riafco-blue)] duration-500">Read More <FiArrowRight className="ms-1 text-sm"/></Link>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>

                <div className={`fixed z-50 flex items-center justify-center overflow-hidden inset-0 m-auto bg-gray-900 bg-opacity-50 dark:bg-opacity-80 ${modal ? '': 'hidden'}`}>
                    <div className="relative w-full h-auto max-w-lg p-4">
                        <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-gray-700">
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                                <h5 className="text-xl font-semibold">Add blog or news</h5>
                                <button type="button" onClick={() => setModal(!modal)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ms-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                                    <AiOutlineClose className="size-5"/>
                                </button>
                            </div>
                            <div className="p-4">
                                <div>
                                    <p className="font-semibold mb-4">Upload your blog image here, Please click &quot;Upload Image&quot; Button.</p>

                                    {uploadFile ? 
                                    <div className="preview-box flex justify-center rounded-md shadow-sm dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 text-slate-400 p-2 text-center small w-auto max-h-60">
                                        <img src={uploadFile} alt="" className="preview-content"/> 
                                    </div>:  
                                    <div className="preview-box flex justify-center rounded-md shadow-sm dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 text-slate-400 p-2 text-center small w-auto max-h-60">Supports JPG, PNG and MP4 videos. Max file size : 10MB.</div>
                                  }
                                    
                                    
                                   
                                  
                                    <input type="file" id="input-file" name="input-file" accept="image/*"  hidden onChange={(e) => handleChange(e)} />
                                    <label className="btn-upload py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md mt-6 cursor-pointer" htmlFor="input-file">Upload Image</label>
                                </div>
                                
                                <form className="mt-4">
                                    <div className="grid grid-cols-12 gap-3">
                                        <div className="col-span-12">
                                            <label className="font-semibold">Blog Title <span className="text-red-600">*</span></label>
                                            <input name="name" id="name" type="text" className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0 mt-2" placeholder="Title :"/>
                                        </div>

                                        <div className="col-span-12">
                                            <label className="font-semibold"> Description : </label>
                                            <textarea name="comments" id="comments" className="form-input w-full py-2 px-3 h-24 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0 mt-2" placeholder="Description :"></textarea>
                                        </div>

                                        <div className="col-span-12">
                                            <button type="submit" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md">Create Blog</button>
                                        </div>
                                    </div>
                                </form>
                            </div>                    
                        </div>
                    </div>
                </div>


                <div className="flex justify-end mt-6">
                    <nav aria-label="Page navigation example">
                        <ul className="inline-flex items-center -space-x-px">
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-s-lg hover:text-white border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">
                                    <MdKeyboardArrowLeft className="text-[20px] rtl:rotate-180 rtl:-mt-1"/>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">1</Link>
                            </li>
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">2</Link>
                            </li>
                            <li>
                                <Link to="#" aria-current="page" className="z-10 size-[40px] inline-flex justify-center items-center text-white bg-[var(--riafco-blue)] border border-[var(--riafco-blue)]">3</Link>
                            </li>
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">4</Link>
                            </li>
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">5</Link>
                            </li>
                            <li>
                                <Link to="#" className="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-e-lg hover:text-white border border-gray-100 dark:border-gray-700 hover:border-[var(--riafco-orange)] dark:hover:border-[var(--riafco-orange)] hover:bg-[var(--riafco-orange)] dark:hover:bg-[var(--riafco-orange)]">
                                    <MdKeyboardArrowRight className="text-[20px] rtl:rotate-180 rtl:-mt-1"/>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}