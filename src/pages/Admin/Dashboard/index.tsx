
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Order from "../../../components/dashboard/order"
import Chat from "../../../components/dashboard/chat"
import TopProduct from "../../../components/dashboard/topProduct"
import DataStates from "../../../components/dataStates"
import Analytics from "../../../components/analytics"
import { BiExport } from "react-icons/bi"
import dashboardService from "../../../services/dashboardService"
import { useAuth } from "../../../hooks/useAuth"
import { toast } from "sonner"


export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resultats = await dashboardService.getStats();
                setStats(resultats.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast.error(error.message || "Error fetching stats");
            }
        }

        fetchStats();
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="flex justify-between items-center">
                        <div>
                            <h5 className="text-xl font-bold">
                                Hello, {user?.firstName} {user?.lastName}  </h5>
                            <h6 className="text-slate-400 font-semibold">Bienvenue!</h6>
                        </div>


                    </div>
                    {stats && stats.users &&
                        <DataStates stats={stats} />
                    }
                </div>
            </div>
        </>
    )

}