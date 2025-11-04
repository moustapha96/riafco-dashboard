

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logoImg from '../../assets/images/logo-light.png';
import Switcher from '../../components/switcher';
import BackButton from '../../components/backButton';

import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

// image de fond (tu peux en changer si tu veux)
import riafcoAbout1 from '../../assets/images/riafco-about-1.jpg';

export default function AuthLogin() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const emailUrl = searchParams.get('email');

    const [email, setEmail] = useState(emailUrl || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.classList.add('light');
        htmlTag.classList.remove('dark');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login({ email, password });
            if (response.token && response.user) {
                login({ ...response.user, token: response.token }, rememberMe);
            } else {
                setError('Aucun token reçu. Veuillez réessayer.');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.message || "Email ou mot de passe incorrect. Veuillez réessayer.");
            if (err?.code === 'ACCOUNT_INACTIVE') {
                navigate('/auth/lock-screen');
            }
            setError(
                err instanceof Error
                    ? err.message
                    : "Email ou mot de passe incorrect. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Section plein écran avec image de fond + overlay dégradé */}
            <section
                className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${riafcoAbout1})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                <div className="container relative">
                    <div className="flex justify-center">
                        {/* Carte centrale */}
                        <div className="max-w-[420px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                            <div className="text-center">
                                <Link to="/">
                                    <img src={logoImg} className="mx-auto h-20" alt="RIAFCO" />
                                </Link>
                            </div>

                            <h5 className="my-6 text-xl font-semibold text-slate-800 dark:text-white text-center">
                                Connexion
                            </h5>

                            <form onSubmit={handleLogin} className="text-start">
                                {error && (
                                    <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1">
                                    {/* Email */}
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginEmail">
                                            Adresse email :
                                        </label>
                                        <input
                                            id="LoginEmail"
                                            type="email"
                                            className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Mot de passe + toggle */}
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginPassword">
                                            Mot de passe :
                                        </label>
                                        <div className="relative mt-3">
                                            <input
                                                id="LoginPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-[var(--riafco-blue)] dark:border-gray-800 dark:focus:border-[var(--riafco-blue)] focus:ring-0 pr-10"
                                                placeholder="*******"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                            >
                                                {showPassword ? (
                                                    <i className="mdi mdi-eye-off-outline text-xl" />
                                                ) : (
                                                    <i className="mdi mdi-eye-outline text-xl" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember + Forgot */}
                                    <div className="flex justify-between mb-4">
                                        <label className="flex items-center gap-2 select-none cursor-pointer">
                                            <input
                                                className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-[var(--riafco-orange)] focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                                                type="checkbox"
                                                id="RememberMe"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <span className="text-slate-500">Se souvenir de moi</span>
                                        </label>

                                        <p className="text-slate-500 mb-0">
                                            <Link to="/auth/re-password" className="text-[var(--riafco-blue)] hover:underline">
                                                Mot de passe oublié ?
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <div className="mb-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`py-2 px-5 ant-btn-primary  inline-block font-semibold tracking-wide duration-500 text-base text-center 
                                                 text-white rounded-md w-full ${isLoading ? 'opacity-60 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                                        </button>
                                    </div>

                                    {/* Lien d'inscription (optionnel) */}
                                    {/* <div className="text-center mt-3">
                                        <span className="text-slate-500 me-2">Pas de compte ?</span>
                                        <Link to="/auth/signup" className="text-[var(--riafco-blue)] font-bold hover:underline">
                                            S’inscrire
                                        </Link>
                                    </div> */}


                                </div>
                            </form>

                            <div className="text-center mt-6">
                                <p className="mb-0 text-slate-400 text-sm">
                                    © {new Date().getFullYear()} RIAFCO. Réalisé avec par{' '}
                                    <Link to="https://alhussein-khouma.vercel.app/" target="_blank" className="text-[var(--riafco-blue)] hover:underline">
                                        ADM
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
