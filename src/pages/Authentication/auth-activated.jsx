

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import logoImg from "../../assets/images/logo-light.png";
import Switcher from "../../components/switcher";
import BackButton from "../../components/backButton";
import { toast } from "sonner";


import { authService } from "../../services/authService";

import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";

export default function AuthActivateAccount() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState ("pending");
    const [isActivating, setIsActivating] = useState(true);
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate();

    // Harmonise le html comme sur Login
    useEffect(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute("dir", "ltr");
        htmlTag.classList.add("light");
        htmlTag.classList.remove("dark");
    }, []);

    // Activation automatique au chargement
    useEffect(() => {
        const run = async () => {
            if (!token) {
                setStatus("error");
                setIsActivating(false);
                toast.error("Lien d’activation manquant ou invalide.");
                return;
            }

            try {
                const response = await authService.activatedAccount(token);
                toast.success(response?.message || "Compte activé avec succès !");
                setStatus("success");

                // Prépare une redirection propre vers /auth/login?email=...
                const nextEmail = (response?.user?.email || email || "").trim();
                // délai court pour que l’utilisateur lise le message
                setTimeout(() => {
                    const qs = nextEmail ? `?email=${encodeURIComponent(nextEmail)}` : "";
                    navigate(`/auth/login${qs}`);
                }, 3500);
            } catch (err) {
                console.error(err);
                setStatus("error");
                toast.error("Lien d’activation invalide ou expiré.");
            } finally {
                setIsActivating(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleResend = async () => {
        if (!email) {
            toast.warning("Adresse e-mail introuvable. Veuillez vous reconnecter.");
            navigate("/auth/login");
            return;
        }

        try {
            setIsResending(true);
            const response = await authService.resendActivation(email);
            toast.success(response?.message || "Lien d’activation renvoyé.");
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Impossible de renvoyer le lien d’activation.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            {/* Même structure visuelle que Login */}
            <section
                className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${riafcoAbout1})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                <div className="container relative">
                    <div className="flex justify-center">
                        {/* Carte centrale */}
                        <div className="max-w-[480px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                            <div className="text-center">
                                <Link to="/">
                                    <img src={logoImg} className="mx-auto h-20" alt="RIAFCO" />
                                </Link>
                            </div>

                            <h5 className="my-6 text-xl font-semibold text-slate-800 dark:text-white text-center">
                                Activation du compte
                            </h5>

                            {/* Contenu état */}
                            <div className="text-center">
                                {isActivating && (
                                    <div className="flex flex-col items-center gap-4 py-2">
                                        {/* petit spinner tailwind */}
                                        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--riafco-blue)] border-t-transparent" />
                                        <p className="text-slate-500">Activation en cours…</p>
                                    </div>
                                )}

                                {!isActivating && status === "success" && (
                                    <div className="p-3 rounded border border-emerald-300 bg-emerald-50 text-emerald-700">
                                        ✅ Votre compte a été activé ! Redirection vers la connexion…
                                    </div>
                                )}

                                {!isActivating && status === "error" && (
                                    <div className="space-y-4">
                                        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700">
                                            ❌ Lien d’activation invalide ou expiré.
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isResending}
                                            className={`py-2 px-5 inline-block font-semibold tracking-wide duration-500 text-base text-center ant-btn-primary text-white rounded-md w-full ${isResending ? "opacity-60 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isResending ? "Renvoi en cours…" : "Renvoyer le lien d’activation"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="text-center mt-6">
                                <Link to="/auth/login" className="text-[var(--riafco-blue)] hover:underline font-semibold">
                                    Aller à la connexion
                                </Link>
                            </div>

                            <div className="text-center mt-6">
                                <p className="mb-0 text-slate-400 text-sm">
                                    © {new Date().getFullYear()} RIAFCO. Réalisé avec par{" "}
                                    <Link
                                        to="https://alhussein-khouma.vercel.app/"
                                        target="_blank"
                                        className="text-[var(--riafco-blue)] hover:underline"
                                    >
                                        ALHK
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                        {/* /carte */}
                    </div>
                </div>
            </section>

            {/* utilitaires existants */}
            <Switcher />
            <BackButton />
        </>
    );
}
