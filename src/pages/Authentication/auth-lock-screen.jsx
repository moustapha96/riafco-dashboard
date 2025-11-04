// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable no-unused-vars */
// "use client"

// import { useEffect, useState } from "react"

// import { Button, message } from "antd"
// import { Link, useLocation, useNavigate } from "react-router-dom"

// import logoImg from "../../assets/images/logo-light.png"
// import contactImg from "../../assets/images/contact.svg"
// import riafcoAbout from "../../assets/images/riafco-about-2.jpg";
// import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";
// export default function AuthInactiveScreen() {
//     const navigate = useNavigate()

//     const location = useLocation()
//     const searchParams = new URLSearchParams(location.search)

//     const [userEmail, setUserEmail] = useState("")

//     useEffect(() => {
//         document.documentElement.setAttribute("dir", "ltr")
//         document.documentElement.classList.add("light")
//         document.documentElement.classList.remove("dark")

//         const email = searchParams.get("email") || localStorage.getItem("userEmail") || "Utilisateur"
//         setUserEmail(email)
//     }, [searchParams])

//     const handleContactSupport = () => {
//         message.info("Redirection vers le support...")
//         navigate("/contact-support")
//     }

//     const handleLogout = () => {
//         localStorage.clear()
//         navigate("/auth/login")
//     }

//     return (
//         <>
//             <section className="relative overflow-hidden">
//                 <div className="absolute inset-0 bg-[var(--riafco-blue)]/[0.02]"></div>
//                 <div className="container-fluid relative">
//                     <div className="md:flex items-center">
//                         <div className="xl:w-[50%] lg:w-1/2 md:w-1/2">
//                             <div className="relative md:flex flex-col md:min-h-screen justify-center bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 md:px-10 py-10 px-4 z-1">
//                                 <div className="text-center">
//                                     <Link href="/">
//                                         <img src={logoImg} className="mx-auto h-26" alt="RIAFCO Logo" />
//                                     </Link>
//                                 </div>
//                                 <div className="title-heading text-center md:my-auto my-20">
//                                     <div className="text-center">
//                                         <h5 className="mb-6 mt-4 text-xl font-semibold text-orange-600">Compte Inactif</h5>

//                                     </div>

//                                     <div className="text-center space-y-4">
//                                         <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
//                                             <h6 className="font-semibold text-orange-800 mb-3">Votre compte est temporairement inactif</h6>
//                                             <p className="text-orange-700 text-sm leading-relaxed">
//                                                 Votre compte a été désactivé temporairement. Veuillez contacter l'administrateur pour réactiver
//                                                 votre accès ou vérifier votre statut d'utilisateur.
//                                             </p>
//                                         </div>



//                                         <div className="text-center mt-6">
//                                             <p className="text-slate-400 text-sm">

//                                                 <Link to="/auth/login" className="text-[var(--riafco-blue)] hover:underline">
//                                                     Connectez-vous
//                                                 </Link>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="mb-0 text-[var(--riafco-orange)]">
//                                         © {new Date().getFullYear()} RIAFCO by{" "}
//                                         <Link href="https://alhussein-khouma.vercel.app/" target="_blank" className="text-reset">
//                                             ADM
//                                         </Link>
//                                         .
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="xl:w-[50%] lg:w-1/2 md:w-1/2 flex justify-center mx-6 md:my-auto my-20">
//                             <div>
//                                 <div className="relative">
//                                     <div className="absolute top-20 start-20 bg-[var(--riafco-blue)]/[0.02] size-[1200px] rounded-full"></div>
//                                     <div className="absolute bottom-20 -end-20 bg-[var(--riafco-blue)]/[0.02] size-[600px] rounded-full"></div>
//                                 </div>

//                                 <div className="text-center">
//                                     <div>
//                                         <img src={riafcoAbout1} className="max-w-xl mx-auto" alt="" />
//                                         <div className="relative max-w-xl mx-auto text-start">
//                                             <div className="relative p-8 border-2 border-[var(--riafco-blue)] rounded-[30px] before:content-[''] before:absolute before:w-28 before:border-[6px] before:border-white dark:before:border-slate-900 before:-bottom-1 before:start-16 before:z-2 after:content-[''] after:absolute after:border-2 after:border-[var(--riafco-blue)] after:rounded-none after:rounded-e-[50px] after:w-20 after:h-20 after:-bottom-[80px] after:start-[60px] after:z-3 after:border-s-0 after:border-b-0">
//                                                 <span className="font-semibold leading-normal">
//                                                     Notre équipe support est là pour vous aider à résoudre rapidement les problèmes d'accès et
//                                                     réactiver votre compte dans les plus brefs délais.
//                                                 </span>

//                                                 <div className="absolute text-8xl -top-0 start-4 text-[var(--riafco-blue)]/10 dark:text-[var(--riafco-blue)]/20 -z-1">
//                                                     <i className="mdi mdi-format-quote-open"></i>
//                                                 </div>
//                                             </div>

//                                             <div className="text-lg font-semibold mt-6 ms-44">- Équipe RIAFCO</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }


/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Button, message } from "antd"
import { Link, useLocation, useNavigate } from "react-router-dom"

import logoImg from "../../assets/images/logo-light.png"
import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg"

export default function AuthInactiveScreen() {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)

    const [userEmail, setUserEmail] = useState("")

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr")
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")

        const email = searchParams.get("email") || localStorage.getItem("userEmail") || "Utilisateur"
        setUserEmail(email)
    }, [searchParams])

    const handleContactSupport = () => {
        message.info("Redirection vers le support…")
        navigate("/contact-support")
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate("/auth/login")
    }

    return (
        <section
            className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${riafcoAbout1})` }}
        >
            {/* overlay */}
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

                        {/* Titre */}
                        <div className="text-center my-6">
                            <h5 className="text-2xl font-bold text-orange-600">Compte inactif</h5>
                            <p className="text-slate-500 text-sm mt-1">
                                {typeof userEmail === "string" ? userEmail : "Utilisateur"}
                            </p>
                        </div>

                        {/* Message */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 text-left">
                            <h6 className="font-semibold text-orange-800 mb-2">
                                Votre compte est temporairement inactif
                            </h6>
                            <p className="text-orange-700 text-sm leading-relaxed">
                                Votre compte a été désactivé temporairement. Veuillez contacter l’administrateur pour
                                réactiver votre accès ou vérifier votre statut d’utilisateur.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button type="primary" className="flex-1" onClick={handleContactSupport}>
                                Contacter le support
                            </Button>
                            <Link to="/auth/login" className="flex-1">
                                <Button className="w-full">Se connecter</Button>
                            </Link>
                        </div>

                        <div className="mt-3 text-center">
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-slate-700 text-sm underline"
                            >
                                Se déconnecter / Changer de compte
                            </button>
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
                                    ADM
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
