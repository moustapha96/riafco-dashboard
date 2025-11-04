import {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import { galleryData, images } from "../../data/data";

import {Lightbox} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function Gallerytwo(){

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isOpen, setisOpen] = useState(false);

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setisOpen(true);
    };
    const slides = images.map((image) => ({ src: image }));

    
    const matchCategory = (category) => {
        setSelectedCategory(category);
    };

    const filteredData = selectedCategory
        ? galleryData.filter((item) => item.category === selectedCategory)
        : galleryData;
    return(
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">Gallery</h5>

                    <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-[var(--riafco-blue)] dark:hover:text-white"><Link to="/">Techwind</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><MdKeyboardArrowRight/></li>
                        <li className="inline-block capitalize text-[14px] font-bold text-[var(--riafco-blue)] dark:text-white" aria-current="page">Gallery</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 items-center mt-6 gap-6">
                    <div className="filters-group-wrap">
                        <div className="filters-group">
                            <ul className="list-none container-filter-border-bottom filter-options space-x-3">
                                <li className={`${selectedCategory === null ? 'active' : ''} inline-block font-semibold mb-3 cursor-pointer relative border-b border-transparent text-slate-400 duration-500 `} data-group="all" onClick={() => matchCategory(null)}>All</li>
                                <li className={`${selectedCategory === 'branding' ? 'active' : ''} inline-block font-semibold mb-3 cursor-pointer relative border-b border-transparent text-slate-400 duration-500 `} data-group="branding" onClick={() => matchCategory('branding')}>Branding</li>
                                <li className={`${selectedCategory === 'designing' ? 'active' : ''} inline-block font-semibold mb-3 cursor-pointer relative border-b border-transparent text-slate-400 duration-500 `} data-group="designing" onClick={() => matchCategory('designing')}>Designing</li>
                                <li className={`${selectedCategory === 'photography' ? 'active' : ''} inline-block font-semibold mb-3 cursor-pointer relative border-b border-transparent text-slate-400 duration-500 `} data-group="photography" onClick={() => matchCategory('photography')}>Photography</li>
                                <li className={`${selectedCategory === 'development' ? 'active' : ''} inline-block font-semibold mb-3 cursor-pointer relative border-b border-transparent text-slate-400 duration-500 `} data-group="development" onClick={() => matchCategory('development')}>Development</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="grid" className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-6 gap-6">
                    {filteredData.map((item, index) => {
                        return(
                            <div className=" picture-item" key={index}>
                                <div className="group relative block overflow-hidden rounded-md duration-500">
                                    <Link to="" onClick={() => handleImageClick(item.id)} className="lightbox duration-500 group-hover:scale-105" title="">
                                        <img src={item.image} className="" alt=""/>
                                    </Link>
                                    <div className="absolute -bottom-52 group-hover:bottom-2 start-2 end-2 duration-500 bg-white dark:bg-slate-900 p-4 rounded shadow-sm dark:shadow-gray-700">
                                        <Link to="" className="hover:text-[var(--riafco-blue)] text-lg duration-500 font-medium">Iphone mockup</Link>
                                        <h6 className="text-slate-400">Branding</h6>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Lightbox
                    open={isOpen}
                    close={() => setisOpen(false)}
                    slides={slides}
                    index={currentImageIndex} // Show the clicked image first
                />

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