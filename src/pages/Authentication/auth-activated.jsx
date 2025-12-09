

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

    console.log("email", email);
    console.log("token", token);
    const [status, setStatus] = useState("pending");
    const [isActivating, setIsActivating] = useState(true);
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate();

    // Vérifier le protocole HTTPS sur localhost (avant les hooks de rendu conditionnel)
    const isHttpsLocalhost = typeof window !== "undefined" && 
                             window.location.protocol === "https:" && 
                             (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    // Harmonise le html comme sur Login
    useEffect(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute("dir", "ltr");
        htmlTag.classList.add("light");
        htmlTag.classList.remove("dark");
        
        // Vérifier si on utilise https:// avec localhost
        if (isHttpsLocalhost) {
            console.warn("⚠️ HTTPS détecté sur localhost. Utilisez http://localhost:3000 pour le développement.");
        }
    }, [isHttpsLocalhost]);

    // Activation automatique au chargement
    useEffect(() => {
        // Ne pas activer si c'est HTTPS localhost
        if (isHttpsLocalhost) {
            setIsActivating(false);
            return;
        }

        const run = async () => {
            if (!token) {
                setStatus("error");
                setIsActivating(false);
                toast.error("Lien d'activation manquant ou invalide.");
                return;
            }

            try {
                const response = await authService.activatedAccount(token);
                toast.success(response?.message || "Compte activé avec succès !");
                setStatus("success");

                // Prépare une redirection propre vers /auth/login?email=...
                const nextEmail = (response?.user?.email || email || "").trim();
                // délai court pour que l'utilisateur lise le message
                setTimeout(() => {
                    const qs = nextEmail ? `?email=${encodeURIComponent(nextEmail)}` : "";
                    navigate(`/auth/login${qs}`);
                }, 3500);
            } catch (err) {
                console.error("Erreur d'activation:", err);
                setStatus("error");
                
                // Message d'erreur plus détaillé
                const errorMessage = err?.response?.data?.message || 
                                   err?.message || 
                                   "Lien d'activation invalide ou expiré.";
                toast.error(errorMessage);
                
                // Si c'est une erreur réseau (SSL, connexion), donner plus d'infos
                if (err?.code === 'ERR_NETWORK' || err?.message?.includes('SSL')) {
                    console.warn("Erreur réseau détectée. Vérifiez que le lien utilise http:// et non https:// en développement.");
                }
            } finally {
                setIsActivating(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isHttpsLocalhost]);

    const handleResend = async () => {
        if (!email) {
            toast.warning("Adresse e-mail introuvable. Veuillez vous reconnecter.");
            navigate("/auth/login");
            return;
        }

        try {
            setIsResending(true);
            const response = await authService.resendActivation(email);
            toast.success(response?.message || "Lien d'activation renvoyé.");
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Impossible de renvoyer le lien d'activation.");
        } finally {
            setIsResending(false);
        }
    };

    // Tous les hooks sont maintenant appelés, on peut faire des returns conditionnels
    if (isHttpsLocalhost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Problème de connexion SSL</h2>
                        <p className="text-gray-600 mb-4">
                            Vous utilisez HTTPS avec localhost, ce qui n'est pas supporté en développement.
                        </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800 mb-2 font-semibold">✅ Solution :</p>
                        <p className="text-sm text-blue-700 mb-3">
                            Remplacez <code className="bg-blue-100 px-2 py-1 rounded">https://</code> par <code className="bg-blue-100 px-2 py-1 rounded">http://</code> dans l'URL
                        </p>
                        <div className="bg-white border border-blue-200 rounded p-3 text-left">
                            <p className="text-xs text-gray-600 mb-1">URL correcte :</p>
                            <code className="text-xs text-blue-600 break-all">
                                {`http://localhost:3000/auth/activate?email=${encodeURIComponent(email)}&token=${token}`}
                            </code>
                        </div>
                    </div>
                    <a
                        href={`http://localhost:3000/auth/activate?email=${encodeURIComponent(email)}&token=${token}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Cliquez ici pour utiliser HTTP
                    </a>
                </div>
            </div>
        );
    }

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
                                {status === "pending" && isActivating && (
                                    <div className="flex flex-col items-center gap-4 py-2">
                                        {/* petit spinner tailwind */}
                                        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--riafco-blue)] border-t-transparent" />
                                        <p className="text-slate-500">Activation en cours…</p>
                                        {!token && (
                                            <p className="text-xs text-red-500 mt-2">
                                                ⚠️ Aucun token détecté dans l'URL
                                            </p>
                                        )}
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
                                            ❌ Lien d'activation invalide ou expiré.
                                            {!token && (
                                                <p className="text-xs mt-2">
                                                    Le token est manquant dans l'URL. Assurez-vous d'utiliser le lien complet depuis votre email.
                                                </p>
                                            )}
                                            {window.location.protocol === "https:" && window.location.hostname === "localhost" && (
                                                <p className="text-xs mt-2 font-semibold">
                                                    ⚠️ Vous utilisez HTTPS. Veuillez utiliser http://localhost:3000 au lieu de https://localhost:3000
                                                </p>
                                            )}
                                        </div>

                                        {email && (
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={isResending}
                                                className={`py-2 px-5 inline-block font-semibold tracking-wide duration-500 text-base text-center ant-btn-primary text-white rounded-md w-full ${isResending ? "opacity-60 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                {isResending ? "Renvoi en cours…" : "Renvoyer le lien d'activation"}
                                            </button>
                                        )}
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
