import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800">
            <h1 className="text-6xl font-bold text-red-500 dark:text-red-400">404</h1>
            <p className="text-2xl mb-10">La page que vous cherchez n'existe pas.</p>
            <Link to="/" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-[var(--riafco-blue)] hover:bg-indigo-700 border-[var(--riafco-blue)] hover:border-indigo-700 text-white rounded-md">Retourner à l'accueil</Link>
        </div>
    )
}
