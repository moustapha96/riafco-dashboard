// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react"
// import { Link, useNavigate } from "react-router-dom";

// import logoImg from '../../assets/images/logo-light.png';
// import contactImg from '../../assets/images/contact.svg'

// import Switcher from '../../components/switcher';
// import BackButton from "../../components/backButton";
// import authService from "../../services/authService";
// import { toast } from "sonner";
// import riafcoAbout from "../../assets/images/riafco-about-2.jpg";
// import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";

// export default function AuthResetPassword(){

//     const [isLoading, setIsLoading] = useState(false);
//     const [email, setEmail] = useState('');
//     const navigate = useNavigate();
    
//      const handleResetPassword = async (e) => {
//             e.preventDefault();
//          setIsLoading(true);
//          const body = { email };
//          console.log(body)
//          try {
//              const response = await authService.forgotPassword(body);
//                 console.log(response)
//                 toast.success("Un email de réinitialisation a été envoyé.");
//              navigate('/auth/login');
//             } catch (err) {
//                 toast.error("Erreur lors de l'envoi de l'email de réinitialisation.");
//                 console.error("Erreur lors de la connexion:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//     };
    
//     useEffect(() => {
//         document.documentElement.setAttribute("dir", "ltr");
//         document.documentElement.classList.add('light');
//         document.documentElement.classList.remove('dark');
//     }, []);
    
//     return(
//         <>
//         <section className="relative overflow-hidden">
//             <div className="absolute inset-0 bg-[var(--riafco-blue)]/[0.02]"></div>
//             <div className="container-fluid relative">
//                 <div className="md:flex items-center">
//                     <div className="xl:w-[40%] lg:w-1/3 md:w-1/2">
//                         <div className="relative md:flex flex-col md:min-h-screen justify-center bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 md:px-10 py-10 px-4 z-1">
//                                 <div className="text-center">
//                                     <Link href="/">
//                                         <img src={logoImg} className="mx-auto h-26" alt="RIAFCO Logo" />
//                                     </Link>
//                                 </div>

//                             <div className="title-heading text-center md:my-auto my-20">
//                                 <form onSubmit={handleResetPassword} className="text-start">
//                                     <div className="grid grid-cols-1">
//                                         <div className="mb-4">
                                           
//                                                 <div className="mb-4">
//                                                     <label className="font-semibold" htmlFor="LoginEmail">Adresse Email:</label>
//                                                     <input
//                                                         id="LoginEmail"
//                                                         type="email"
//                                                         className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
//                                                         placeholder="name@example.com"
//                                                         value={email}
//                                                         onChange={(e) => setEmail(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                             </div>

//                                         <div className="mb-4">
                                           
//                                                 <button
//                                                     type="submit"
//                                                     disabled={isLoading}
//                                                     className={`py-2 px-5 inline-block tracking-wide border-[var(--riafco-blue)] align-middle duration-500
//                                                          text-base text-center ant-btn-primary
//                                                          text-white rounded-md w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                                 >
//                                                     {isLoading ? 'envoie en cours...' : 'Envoyer'}
//                                                 </button>
//                                             </div>

//                                         <div className="text-center">
//                                                 <Link to="/auth/login" className="text-[var(--riafco-orange)] dark:text-white font-bold inline-block">Se connecter</Link>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                             <div className="text-center">
//                                     <p className="mb-0 text-slate-400">© {new Date().getFullYear()} RIAFCO. Design & Develop with <i className="mdi mdi-heart text-red-600"></i> by <Link to="https://alhussein-khouma.vercel.app/" target="_blank" className="text-reset">ADM</Link>.</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="xl:w-[60%] lg:w-2/3 md:w-1/2 flex justify-center mx-6 md:my-auto my-20">
//                         <div>
//                             <div className="relative">
//                                 <div className="absolute top-20 start-20 bg-[var(--riafco-blue)]/[0.02] size-[1200px] rounded-full"></div>
//                                 <div className="absolute bottom-20 -end-20 bg-[var(--riafco-blue)]/[0.02] size-[600px] rounded-full"></div>
//                             </div>

//                             <div className="text-center">
//                                 <div>
//                                         <img src={riafcoAbout1} className="max-w-xl mx-auto" alt=""/>
//                                     <div className="relative max-w-xl mx-auto text-start">
//                                         <div className="relative p-8 border-2 border-[var(--riafco-blue)] rounded-[30px] before:content-[''] before:absolute before:w-28 before:border-[6px] before:border-white dark:before:border-slate-900 before:-bottom-1 before:start-16 before:z-2 after:content-[''] after:absolute after:border-2 after:border-[var(--riafco-blue)] after:rounded-none after:rounded-e-[50px] after:size-20 after:-bottom-[80px] after:start-[60px] after:z-3 after:border-s-0 after:border-b-0">
//                                             <span className="font-semibold leading-normal">
//                                                     RIAFCO | Réseau des Institutions Africaines de Financement des Collectivités locales
//                                                 </span>
            
//                                             <div className="absolute text-8xl -top-0 start-4 text-[var(--riafco-blue)]/10 dark:text-[var(--riafco-blue)]/20 -z-1">
//                                                 <i className="mdi mdi-format-quote-open"></i>
//                                             </div>
//                                         </div>
            
//                                         <div className="text-lg font-semibold mt-6 ms-44">
//                                             - RIAFCO
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//         <Switcher/>
//         <BackButton/>
//         </>
//     )
// }
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImg from "../../assets/images/logo-light.png";
import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";

import Switcher from "../../components/switcher";
import BackButton from "../../components/backButton";
import authService from "../../services/authService";
import { toast } from "sonner";

export default function AuthResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute("dir", "ltr");
        html.classList.add("light");
        html.classList.remove("dark");
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const body = { email };
            await authService.forgotPassword(body);
            toast.success("Un email de réinitialisation a été envoyé.");
            navigate("/auth/login");
        } catch (err) {
            console.error("Erreur lors de l'envoi de l'email :", err);
            toast.error("Erreur lors de l'envoi de l'email de réinitialisation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Même design que le login : fond image + overlay + carte centrée */}
            <section
                className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${riafcoAbout1})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                <div className="container relative">
                    <div className="flex justify-center">
                        <div className="max-w-[460px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                            {/* Logo */}
                            <div className="text-center">
                                <Link to="/">
                                    <img src={logoImg} className="mx-auto h-20" alt="RIAFCO Logo" />
                                </Link>
                            </div>

                            {/* Titre / sous-titre */}
                            <div className="text-center my-6">
                                <h5 className="text-xl font-semibold">Réinitialiser le mot de passe</h5>
                                <p className="text-slate-500 mt-1">
                                    Entrez votre adresse email, nous vous enverrons un lien de réinitialisation.
                                </p>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleResetPassword} className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="ResetEmail">
                                            Adresse Email :
                                        </label>
                                        <input
                                            id="ResetEmail"
                                            type="email"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center ant-btn-primary text-white rounded-md w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <Link
                                            to="/auth/login"
                                            className="text-[var(--riafco-orange)] font-bold inline-block hover:underline"
                                        >
                                            Se connecter
                                        </Link>
                                    </div>
                                </div>
                            </form>

                            {/* Footer mini */}
                            <div className="text-center mt-6">
                                <p className="mb-0 text-slate-400 text-sm">
                                    © {new Date().getFullYear()} RIAFCO. Design & Develop with{" "}
                                    <i className="mdi mdi-heart text-red-600" /> by{" "}
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

            <Switcher />
            <BackButton />
        </>
    );
}
