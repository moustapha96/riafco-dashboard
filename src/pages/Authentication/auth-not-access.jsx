// "use client"

// import { useEffect } from "react"
// import { Button } from "antd"
// import { Link, useNavigate } from "react-router-dom"

// import logoImg from "../../assets/images/logo-light.png"
// import lockImg from "../../assets/images/contact.svg" // tu peux changer par une image de cadenas

// export default function AuthNotAccess() {
//     const navigate = useNavigate()

//     useEffect(() => {
//         document.documentElement.setAttribute("dir", "ltr")
//         document.documentElement.classList.add("light")
//         document.documentElement.classList.remove("dark")
//     }, [])

//     const handleBack = () => {
//         navigate(-1) // retourne à la page précédente
//     }

//     return (
//         <section className="relative overflow-hidden">
//             <div className="absolute inset-0 bg-[var(--riafco-blue)]/[0.02]"></div>
//             <div className="container-fluid relative">
//                 <div className="md:flex items-center">
//                     <div className="xl:w-[50%] lg:w-1/2 md:w-1/2">
//                         <div className="relative md:flex flex-col md:min-h-screen justify-center bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 md:px-10 py-10 px-4 z-1">
//                             <div className="text-center">
//                                 <Link to="/">
//                                     <img src={logoImg} className="mx-auto h-26" alt="RIAFCO Logo" />
//                                 </Link>
//                             </div>

//                             <div className="title-heading text-center md:my-auto my-20">
//                                 <h5 className="mb-6 mt-4 text-2xl font-bold text-red-600">Accès refusé</h5>

//                                 <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                                     <h6 className="font-semibold text-red-800 mb-3">
//                                         Vous n’avez pas accès à cette page
//                                     </h6>
//                                     <p className="text-red-700 text-sm leading-relaxed">
//                                         Si vous pensez qu’il s’agit d’une erreur, veuillez contacter l’administrateur.
//                                     </p>
//                                 </div>

//                                 <div className="text-center mt-6">
//                                     <Button type="primary" onClick={handleBack}>
//                                         Retour
//                                     </Button>
//                                 </div>
//                             </div>

//                             <div className="text-center mt-10">
//                                 <p className="mb-0 text-[var(--riafco-orange)]">
//                                     © {new Date().getFullYear()} RIAFCO by{" "}
//                                     <Link
//                                         to="https://alhussein-khouma.vercel.app/"
//                                         target="_blank"
//                                         className="text-reset"
//                                     >
//                                        RIAFCO
//                                     </Link>
//                                     .
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="xl:w-[50%] lg:w-1/2 md:w-1/2 flex justify-center mx-6 md:my-auto my-20">
//                         <div className="text-center">
//                             <img src={lockImg} className="max-w-lg mx-auto" alt="Access Denied" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

"use client"

import { useEffect } from "react"
import { Button } from "antd"
import { Link, useNavigate } from "react-router-dom"

import logoImg from "../../assets/images/logo-light.png"
import lockImg from "../../assets/images/contact.svg" // image de fond (peut être remplacée)
import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";


export default function AuthNotAccess() {
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr")
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
    }, [])

    const handleBack = () => navigate(-1)

    return (
        <section
            className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${riafcoAbout1})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

            <div className="container relative">
                <div className="flex justify-center">
                    <div className="max-w-[480px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                        {/* Logo */}
                        <div className="text-center">
                            <Link to="/">
                                <img src={logoImg} className="mx-auto h-20" alt="RIAFCO Logo" />
                            </Link>
                        </div>

                        {/* Titre + message */}
                        <div className="text-center my-6">
                            <h5 className="text-2xl font-bold text-red-600">Accès refusé</h5>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
                                <h6 className="font-semibold text-red-800 mb-2">
                                    Vous n’avez pas accès à cette page
                                </h6>
                                <p className="text-red-700 text-sm leading-relaxed">
                                    Si vous pensez qu’il s’agit d’une erreur, veuillez contacter l’administrateur.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button type="primary" onClick={handleBack}>
                                Retour
                            </Button>
                            <Link to="/" className="inline-flex items-center justify-center">
                                <Button>Aller à l’accueil</Button>
                            </Link>
                        </div>

                        {/* Footer mini */}
                        <div className="text-center mt-8">
                            <p className="mb-0 text-[var(--riafco-orange)] text-sm">
                                © {new Date().getFullYear()} RIAFCO by{" "}
                                <Link
                                    to="https://alhussein-khouma.vercel.app/"
                                    target="_blank"
                                    className="text-reset hover:underline"
                                >
                                    RIAFCO
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
