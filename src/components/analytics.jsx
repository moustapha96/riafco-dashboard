import {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import Chart from 'react-apexcharts'
import jsVectorMap from 'jsvectormap'
import 'jsvectormap/dist/maps/world'

export default function Analytics(){
    const [countryDropdown, setCountrydropdown] = useState(false)
    const  options1 = {
        series: [{
            name: 'Profit',
            data: [500, 653, 548, 482, 553, 570, 560, 610, 580, 854, 945, 1150],
        }, {
            name: 'Expenses',
            data: [246, 379, 521, 453, 243, 264, 333, 246, 468, 222, 456, 789]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
                autoSelected: 'zoom'
            },
        },
        grid: {
            strokeDashArray: 5,
    
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                horizontal: false,
                columnWidth: '40%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: ['#4f46e5', '#10b981'],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: 'Profit / Expenses (USD)',

                style: {
                    colors: ['#8492a6'],
                    fontSize: '16px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 600,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$" + val
                }
            }
        }
    };

    useEffect(()=>{
        const modalClose = () =>{
            setCountrydropdown(false)
        }
        document.addEventListener('mousedown', modalClose)
        return () => {
            document.removeEventListener('mousedown', modalClose)
        };
    },[])

    useEffect(() => {
        new jsVectorMap({
            map: 'world',
            selector: '#map',
            zoomOnScroll: true,
            zoomButtons: false,
            selectedMarkers: [0, 1],
            markersSelectable: true,
            markers:[
                { name: "Palestine", coords: [31.9474,35.2272] },
                { name: "Russia", coords: [61.524,105.3188] },
                { name: "Canada", coords: [56.1304,-106.3468] },
                { name: "Greenland", coords: [71.7069,-42.6043] },
            ],
            markerStyle:{
                initial: { fill: "#4f46e5" },
                selected: { fill: "#059669" }
            },
            labels: {
                markers: {
                render: marker => marker.name
                }
            }
        });
      }, []);


    return(
        <div className="grid lg:grid-cols-12 grid-cols-1 mt-6 gap-6">
            <div className="lg:col-span-8">
                <div className="relative overflow-hidden rounded-md shadow-sm-sm dark:shadow-sm-sm-gray-700 bg-white dark:bg-slate-900">
                    <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <h6 className="text-lg font-semibold">Profit / Expenses Analytics</h6>
                        
                        <div className="position-relative">
                            <select className="form-select form-input w-full py-2 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 focus:border-gray-200 dark:border-gray-800 dark:focus:border-gray-700 focus:ring-0" id="yearchart">
                                <option value="Y" defaultValue>Yearly</option>
                                <option value="M">Monthly</option>
                                <option value="W">Weekly</option>
                                <option value="T">Today</option>
                            </select>
                        </div>
                    </div>
                    <div id="mainchart" className="apex-chart px-4 pb-6"></div>
                    <Chart options={options1} series={options1.series} type="bar" width='100%' height={350} />
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="relative overflow-hidden rounded-md shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900">
                    <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <h6 className="text-lg font-semibold">Customers by Country</h6>

                        <div className="dropdown relative">
                            <button onClick={() => setCountrydropdown(!countryDropdown)}>
                                <span className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-800/5 hover:bg-gray-800/10 dark:bg-gray-800 border border-gray-800 dark:border-gray-700/5 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"><i className="mdi mdi-dots-vertical"></i></span>
                            </button>
                            {countryDropdown ? 
                            <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-44 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700">
                                <ul className="py-2 text-start">
                                    <li className="ml-0">
                                        <Link to="" className="block font-medium py-1 px-4 text-slate-400 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">Profile</Link>
                                    </li>
                                    <li className="ml-0">
                                        <Link to="" className="block font-medium py-1 px-4 text-slate-400 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">Profile Settings</Link>
                                    </li>
                                    <li className="ml-0">
                                        <Link to="" className="block font-medium py-1 px-4 text-slate-400 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">Delete</Link>
                                    </li>
                                </ul>
                            </div> : ''
                            }
                        </div>
                    </div>

                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <div className='w-full h-[236px] jvm-container'>
                           <div id="map" className="w-full h-[236px]"></div>
                        </div>
                    </div>

                    <div className="p-6">
                        <ul className="list-none flex">
                            <li className="inline-block w-1/2"><span className="text-[var(--riafco-blue)] font-semibold">Canada</span>:<span className="text-slate-400 ms-2">12468</span></li>
                            <li className="inline-block w-1/2"><span className="text-[var(--riafco-blue)] font-semibold">Greenland</span>:<span className="text-slate-400 ms-2">12468</span></li>
                        </ul>
                        <ul className="list-none flex">
                            <li className="inline-block w-1/2"><span className="text-[var(--riafco-blue)] font-semibold">Russia</span>:<span className="text-slate-400 ms-2">12468</span></li>
                            <li className="inline-block w-1/2"><span className="text-[var(--riafco-blue)] font-semibold">Palestine</span>:<span className="text-slate-400 ms-2">12468</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}