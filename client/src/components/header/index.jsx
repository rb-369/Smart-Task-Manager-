import { TaskManagerContext } from "@/context";
import { callLogoutUserApi } from "@/services";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/logo.png";

function HeaderComp() {

    const { user, setUser } = useContext(TaskManagerContext);
    const navigate = useNavigate();

    async function hadleLogout() {
        const response = await callLogoutUserApi();

        if (response?.success) {
            setUser(null);
            navigate("/auth");
        }
    }

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="container mx-auto h-16 px-4">
                <div className="flex h-full items-center justify-between">

                    {/* ✅ Left : Logo + App name */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="RB's Smart Task Manager"
                            className="h-9 w-9 object-contain"
                        />

                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-bold">
                                RB's Smart Task Manager
                            </span>
                            <span className="text-xs text-gray-500">
                                Welcome, {user?.name}
                            </span>
                        </div>
                    </div>

                    {/* ✅ Center navigation */}
                    <nav className="flex gap-8">
                        <Link to="/tasks/list" className="font-semibold hover:text-blue-600">
                            Tasks
                        </Link>

                        <Link to="/tasks/scrum-board" className="font-semibold hover:text-blue-600">
                            Scrum Board
                        </Link>

                        <Link to="/tasks/info" className="font-semibold hover:text-blue-600">
                            Color Pattern
                        </Link>

                        <Link to="/tasks/stats" className="font-semibold hover:text-blue-600">
                            Stats
                        </Link>
                    </nav>

                    {/* ✅ Right logout */}
                    <div>
                        <LogOut
                            onClick={hadleLogout}
                            className="cursor-pointer hover:text-red-600"
                        />
                    </div>

                </div>
            </div>
        </header>
    );
}

export default HeaderComp;
