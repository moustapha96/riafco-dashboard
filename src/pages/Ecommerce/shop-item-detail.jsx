import {useState, useEffect} from "react";
import { Link,useParams } from "react-router-dom";


import TinySlider from 'tiny-slider-react';
import '../../../node_modules/tiny-slider/dist/tiny-slider.css';

import * as Icon from 'react-feather'

import { productData,productService, productReview } from "../../data/data";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";

const settings = {
    container: '.tiny-single-item',
    items: 1,
    controls: false,
    mouseDrag: true,
    loop: true,
    rewind: true,
    autoplay: true,
    autoplayButtonOutput: false,
    autoplayTimeout: 3000,
    navPosition: "bottom",
    speed: 400,
    gutter: 16,
};

export default function ShopItemDetails(){

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);
    
    let params = useParams()
    let id = params.id

    let data = productData.find((item) => item.id === parseInt(id));

    let [counter, setCounter] = useState(0);
    let [activeIndex, setActiveIndex] = useState(0)
    

    let incrementCounter = () => {
        setCounter(counter + 1);
    };

    let decrementCounter = () => {
        if (counter !== 0) {
            setCounter(counter - 1);
        }
    };

  

    return(
        <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">{data?.name? data?.name :`Branded T-Shirts`}</h5>

                    <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/">Techwind</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/shop">Shop</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold text-[var(--riafco-blue)] dark:text-white" aria-current="page">{data?.name? data?.name :`Branded T-Shirts`}</li>
                    </ul>
                </div>

                <div className="p-6 rounded-md mt-6 shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900">
                    <div className="grid md:grid-cols-12 grid-cols-1 gap-6 items-center">
                        <div className="xl:col-span-4 lg:col-span-5 md:col-span-6">
                            <div className="tiny-single-item">
                                <TinySlider settings={settings}>
                                    {productService.map((item, index) => (
                                        <div className="tiny-slide" key={index}>
                                            <img src={item} className="rounded-md shadow-sm dark:shadow-gray-800" alt="" />
                                        </div>
                                    ))}
                                </TinySlider>
                            </div>
                        </div>
    
                        <div className="xl:col-span-8 lg:col-span-7 md:col-span-6">
                            <div className="lg:ms-6">
                                <h5 className="text-2xl font-semibold">{data?.name? data?.name :`Branded T-Shirts`}</h5>
                                <div className="mt-2">
                                    <span className="text-slate-400 font-semibold me-1">$16USD <del className="text-red-600">$21USD</del></span>
    
                                    <ul className="list-none inline-block text-orange-400">
                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                        <li className="inline text-slate-400 font-semibold">4.8 (45)</li>
                                    </ul>
                                </div>
    
                                <div className="mt-4">
                                    <h5 className="text-lg font-semibold">Overview :</h5>
                                    <p className="text-slate-400 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero exercitationem, unde molestiae sint quae inventore atque minima natus fugiat nihil quisquam voluptates ea omnis. Modi laborum soluta tempore unde accusantium.</p>
                                
                                    <ul className="list-none text-slate-400 mt-4">
                                        <li className="mb-1 flex items-center ml-0"><BsCheckCircle className="text-[var(--riafco-blue)] text-lg me-2"/> Digital Marketing Solutions for Tomorrow</li>
                                        <li className="mb-1 flex items-center ml-0"><BsCheckCircle className="text-[var(--riafco-blue)] text-lg me-2"/> Our Talented & Experienced Marketing Agency</li>
                                        <li className="mb-1 flex items-center ml-0"><BsCheckCircle className="text-[var(--riafco-blue)] text-lg me-2"/> Create your own skin to match your brand</li>
                                    </ul>
                                </div>
    
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
                                    <div className="flex items-center">
                                        <h5 className="text-lg font-semibold me-2">Size:</h5>
                                        <div className="space-x-1">
                                            <Link to="" className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white">S</Link>
                                            <Link to="" className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white">M</Link>
                                            <Link to="" className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white">L</Link>
                                            <Link to="" className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white">XL</Link>
                                        </div>
                                    </div>
    
                                    <div className="flex items-center">
                                        <h5 className="text-lg font-semibold me-2">Quantity:</h5>
                                        <div className="qty-icons ms-3 space-x-1">
                                            <button  onClick={decrementCounter}  className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 border hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white minus">-</button>
                                            <input min="0" name="quantity" defaultValue={counter} type="number" className="h-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white pointer-events-none w-16 ps-4 quantity"/>
                                            <button onClick={incrementCounter} className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white plus">+</button>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="mt-4">
                                    <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md me-2 mt-2">Shop Now</Link>
                                    <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center rounded-md bg-[var(--riafco-blue)]/5 hover:bg-[var(--riafco-orange)] border-[var(--riafco-blue)]/10 hover:border-[var(--riafco-orange)] text-[var(--riafco-blue)] hover:text-white mt-2">Add to Cart</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 grid-cols-1 mt-6 gap-6">
                    <div className="lg:col-span-3 md:col-span-5">
                        <div className="sticky top-20">
                            <ul className="flex-column p-6 bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 rounded-md">
                                <li role="presentation">
                                    <button onClick={() => setActiveIndex(0)} className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-[var(--riafco-blue)] duration-500 ${activeIndex === 0 ?'bg-[var(--riafco-blue)] text-white hover:text-white':''}`} >Description</button>
                                </li>
                                <li role="presentation">
                                    <button onClick={() => setActiveIndex(1)} className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-[var(--riafco-blue)] duration-500 ${activeIndex === 1 ?'bg-[var(--riafco-blue)] text-white hover:text-white':''}`}>Additional Information</button>
                                </li>
                                <li role="presentation">
                                    <button onClick={() => setActiveIndex(2)} className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-[var(--riafco-blue)] duration-500 ${activeIndex === 2 ?'bg-[var(--riafco-blue)] text-white hover:text-white':''}`}>Review</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-9 md:col-span-7">
                        <div id="myTabContent" className="p-6 bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 rounded-md">
                            {activeIndex === 0 ? 
                                <div>
                                    <p className="text-slate-400">Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts. If the distribution of letters and &apos;words&apos; is random, the reader will not be distracted from making a neutral judgement on the visual impact and readability of the typefaces (typography), or the distribution of text on the page (layout or type area). For this reason, dummy text usually consists of a more or less random series of words or syllables.</p>
                                </div> : ''
                            }
                            {activeIndex === 1 ? 
                                <div>
                                    <table className="w-full text-start">
                                        <tbody>
                                            <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                                <td className="font-semibold py-4" style={{width:"100px"}}>Color</td>
                                                <td className="text-slate-400 py-4">Red, White, Black, Orange</td>
                                            </tr>

                                            <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                                <td className="font-semibold py-4">Material</td>
                                                <td className="text-slate-400 py-4">Cotton</td>
                                            </tr>

                                            <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                                <td className="font-semibold py-4">Size</td>
                                                <td className="text-slate-400 py-4">S, M, L, XL, XXL</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> : ''
                            }
                            {activeIndex === 2 ? 
                                <div>
                                    {productReview.map((item,index) => {
                                        return(
                                            <div key={index}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <img src={item.image} className="size-11 rounded-full shadow" alt=""/>
                    
                                                        <div className="ms-3 flex-1">
                                                            <Link to="" className="text-lg font-semibold hover:text-[var(--riafco-blue)] duration-500">{item.name}</Link>
                                                            <p className="text-sm text-slate-400">{item.time}</p>
                                                        </div>
                                                    </div>
                
                                                    <Link to="" className="text-slate-400 hover:text-[var(--riafco-blue)] duration-500 ms-5"><i className="mdi mdi-reply"></i> Reply</Link>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-md shadow-sm dark:shadow-gray-700 mt-6 mb-6">
                                                    <ul className="list-none inline-block text-orange-400">
                                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                                        <li className="inline"><i className="mdi mdi-star text-lg"></i></li>
                                                        <li className="inline text-slate-400 font-semibold">5.0</li>
                                                    </ul>

                                                    <p className="text-slate-400 italic">{item.review}</p>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div className="p-6 rounded-md shadow-sm dark:shadow-gray-700 mt-8">
                                        <h5 className="text-lg font-semibold">Leave A Comment:</h5>
            
                                        <form className="mt-8">
                                            <div className="grid lg:grid-cols-12 lg:gap-6">
                                                <div className="lg:col-span-6 mb-5">
                                                    <div className="text-start">
                                                        <label htmlFor="name" className="font-semibold">Your Name:</label>
                                                        <div className="form-icon relative mt-2">
                                                            <Icon.User className="size-4 absolute top-3 start-4"/>
                                                            <input name="name" id="name" type="text" className="form-input ps-11 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0" placeholder="Name :"/>
                                                        </div>
                                                    </div>
                                                </div>
                
                                                <div className="lg:col-span-6 mb-5">
                                                    <div className="text-start">
                                                        <label htmlFor="email" className="font-semibold">Your Email:</label>
                                                        <div className="form-icon relative mt-2">
                                                            <Icon.Mail className="size-4 absolute top-3 start-4"/>
                                                            <input name="email" id="email" type="email" className="form-input ps-11 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0" placeholder="Email :"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
            
                                            <div className="grid grid-cols-1">
                                                <div className="mb-5">
                                                    <div className="text-start">
                                                        <label htmlFor="comments" className="font-semibold">Your Comment:</label>
                                                        <div className="form-icon relative mt-2">
                                                            <Icon.MessageCircle className="size-4 absolute top-3 start-4"/>
                                                            <textarea name="comments" id="comments" className="form-input ps-11 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0" placeholder="Message :"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md w-full">Send Message</button>
                                        </form>
                                    </div>

                                </div> 
                                
                                :''
                            }
                                       
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}