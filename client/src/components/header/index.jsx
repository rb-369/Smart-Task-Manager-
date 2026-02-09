import { TaskManagerContext } from "@/context";
import { callLogoutUserApi } from "@/services";
import { LogOut, Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/logo5.png";

function HeaderComp() {

    const { user, setUser, darkMode, toggleDarkMode } = useContext(TaskManagerContext);
    const navigate = useNavigate();

    async function hadleLogout() {
        const response = await callLogoutUserApi();

        if (response?.success) {
            setUser(null);
            navigate("/auth");
        }
    }

    // return (
    //     <header className="border-b border-gray-200 bg-white">
    //         <div className="container mx-auto h-16 px-4">
    //             <div className="flex h-full items-center justify-between">

    //                 {/* ✅ Left : Logo + App name */}
    //                 <div className="flex items-center gap-3">
    //                     <img
    //                         src={logo}
    //                         alt="RB's Smart Task Manager"
    //                         className="h-16 w-16 rounded-full object-cover"
    //                     />

    //                     <div className="flex flex-col leading-tight">
    //                         <span className="text-lg font-bold">
    //                             RB's Smart Task Manager
    //                         </span>
    //                         <span className="text-xs text-gray-500">
    //                             Welcome, {user?.name}
    //                         </span>
    //                     </div>
    //                 </div>

    //                 {/* ✅ Center navigation */}
    //                 <nav className="flex gap-8">
    //                     <Link to="/tasks/list" className="font-semibold hover:text-blue-600">
    //                         <p className="text-black text-xl font-bold">Tasks</p>
    //                     </Link>

    //                     <Link to="/tasks/scrum-board" className="font-semibold hover:text-blue-600">
    //                         <p className="text-black text-xl font-bold">Scrum Board</p>
    //                     </Link>

    //                     <Link to="/tasks/info" className="font-semibold hover:text-blue-600">
    //                         <p className="text-black text-xl font-bold">Color Pattern</p>
    //                     </Link>

    //                     <Link to="/tasks/stats" className="font-semibold hover:text-blue-600">
    //                         <p className="text-black text-xl font-bold">Stats</p>
    //                     </Link>
    //                 </nav>

    //                 {/* ✅ Right logout */}
    //                 <div>
    //                     <LogOut
    //                         onClick={hadleLogout}
    //                         className="cursor-pointer hover:text-red-600"
    //                     />
    //                 </div>

    //             </div>
    //         </div>
    //     </header>
    // );

    //better header

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">

                    {/* Left : Logo + name */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md">
                            <img
                                src={logo}
                                alt="RB's Smart Task Manager"
                                className="h-full w-full rounded-full bg-black object-cover"
                            />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                RB's Smart Task Manager
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Welcome, {user?.name}
                            </span>
                        </div>
                    </div>

                    {/* ✅ Center navigation */}
                    <nav className="flex gap-8">
                        <Link to="/tasks/list" className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <p className="text-foreground text-xl font-bold">Tasks</p>
                        </Link>

                        <Link to="/tasks/scrum-board" className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <p className="text-foreground text-xl font-bold">Scrum Board</p>
                        </Link>

                        <Link to="/tasks/info" className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <p className="text-foreground text-xl font-bold">Color Pattern</p>
                        </Link>

                        <Link to="/tasks/stats" className="font-semibold hover:text-blue-600">
                            <p className="text-foreground text-xl font-bold">Stats</p>
                        </Link>
                    </nav>

                    {/* Right: Dark mode toggle + logout */}
                    <div className="flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <div
                            onClick={toggleDarkMode}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-700" />
                            )}
                        </div>

                        {/* Logout button */}
                        <div
                            onClick={hadleLogout}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-red-600" />
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );

}

export default HeaderComp;
