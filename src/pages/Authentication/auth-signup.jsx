

/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import logoImg from "../../assets/images/logo-icon-64.png"
import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg"

import Switcher from "../../components/switcher"
import BackButton from "../../components/backButton"
import authService from "../../services/authService"

export default function Signup() {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [accept, setAccept] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr")
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
    }, [])

    const validate = () => {
        if (!fullName.trim()) return "Le nom est requis."
        if (!email.trim()) return "L’email est requis."
        // validation email légère
        if (!/^\S+@\S+\.\S+$/.test(email)) return "L’email n’est pas valide."
        if (!password) return "Le mot de passe est requis."
        if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères."
        if (password !== confirmPassword) return "Les mots de passe ne correspondent pas."
        if (!accept) return "Veuillez accepter les Termes et Conditions."
        return ""
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const msg = validate()
        if (msg) {
            setError(msg)
            toast.error(msg)
            return
        }

        setIsLoading(true)
        try {
            const body = { name: fullName.trim(), email: email.trim(), password }
            // selon ton service : signup ou register
            const submitFn = authService?.signup || authService?.register
            if (!submitFn) {
                throw new Error("Service d’inscription indisponible.")
            }
            await submitFn(body)
            toast.success("Compte créé avec succès. Vous pouvez vous connecter.")
            navigate("/auth/login")
        } catch (err) {
            const errMsg =
                err?.response?.data?.message ||
                err?.message ||
                "Impossible de créer le compte. Veuillez réessayer."
            setError(errMsg)
            toast.error(errMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <section
                className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${riafcoAbout1})` }}
            >
                {/* overlay dégradé */}
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

                            <h5 className="my-6 text-xl font-semibold text-center">Créer un compte</h5>

                            {/* Erreur globale */}
                            {error && (
                                <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <form className="text-start" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="RegisterName">
                                            Nom complet :
                                        </label>
                                        <input
                                            id="RegisterName"
                                            type="text"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="Ex. Harry Smith"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="RegisterEmail">
                                            Adresse Email :
                                        </label>
                                        <input
                                            id="RegisterEmail"
                                            type="email"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="RegisterPassword">
                                            Mot de passe :
                                        </label>
                                        <input
                                            id="RegisterPassword"
                                            type="password"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="Au moins 8 caractères"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="RegisterConfirm">
                                            Confirmer le mot de passe :
                                        </label>
                                        <input
                                            id="RegisterConfirm"
                                            type="password"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="Répétez le mot de passe"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center w-full mb-0">
                                            <input
                                                className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-[var(--riafco-blue)] focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 me-2"
                                                type="checkbox"
                                                id="AcceptTnC"
                                                checked={accept}
                                                onChange={(e) => setAccept(e.target.checked)}
                                            />
                                            <label className="text-slate-400" htmlFor="AcceptTnC">
                                                J’accepte les{" "}
                                                <Link to="/terme-et-condition" className="text-[var(--riafco-blue)] hover:underline">
                                                    Termes et Conditions
                                                </Link>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`py-2 px-5 inline-block  ant-btn-primary tracking-wide align-middle duration-500 text-base text-center  text-white rounded-md w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isLoading ? "Création du compte…" : "Créer le compte"}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <span className="text-slate-400 me-2">Vous avez déjà un compte ?</span>{" "}
                                        <Link to="/auth/login" className="text-black  dark:text-white font-bold inline-block">
                                            Se connecter
                                        </Link>
                                    </div>
                                </div>
                            </form>

                            {/* Footer mini */}
                            <div className="text-center mt-8">
                                <p className="mb-0 text-[var(--riafco-orange)]">
                                    © {new Date().getFullYear()} RIAFCO by{" "}
                                    <Link to="https://alhussein-khouma.vercel.app/" target="_blank" className="text-reset hover:underline">
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
    )
}
