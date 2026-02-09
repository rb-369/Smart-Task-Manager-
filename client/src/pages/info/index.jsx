import { Fragment } from "react";
import { Link } from "react-router-dom";

function Info() {
    return (
        <Fragment>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <h1 className="mb-10 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
                    Priority Color Guide
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

                    {/* High Priority */}
                    <div className="flex flex-col items-center p-8 rounded-2xl shadow-lg 
                    bg-red-400 dark:bg-red-900/30 dark:border dark:border-red-500/50 transition-all hover:scale-105">
                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                            <span className="text-3xl">🔴</span>
                        </div>
                        <h2 className="text-2xl font-bold text-black dark:text-red-100 mb-2">High Priority</h2>
                        <p className="text-center text-black/80 dark:text-red-200">
                            Urgent tasks that need immediate attention.
                        </p>
                    </div>

                    {/* Medium Priority */}
                    <div className="flex flex-col items-center p-8 rounded-2xl shadow-lg 
                    bg-yellow-300 dark:bg-amber-900/30 dark:border dark:border-amber-500/50 transition-all hover:scale-105">
                        <div className="h-16 w-16 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center mb-4">
                            <span className="text-3xl">🟡</span>
                        </div>
                        <h2 className="text-2xl font-bold text-black dark:text-amber-100 mb-2">Medium Priority</h2>
                        <p className="text-center text-black/80 dark:text-amber-200">
                            Important tasks that should be done soon.
                        </p>
                    </div>

                    {/* Low Priority */}
                    <div className="flex flex-col items-center p-8 rounded-2xl shadow-lg 
                    bg-green-500 dark:bg-green-900/30 dark:border dark:border-green-500/50 transition-all hover:scale-105">
                        <div className="h-16 w-16 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center mb-4">
                            <span className="text-3xl">🟢</span>
                        </div>
                        <h2 className="text-2xl font-bold text-black dark:text-green-100 mb-2">Low Priority</h2>
                        <p className="text-center text-black/80 dark:text-green-200">
                            Tasks that can be done at your leisure.
                        </p>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}

export default Info;
