import { Outlet } from "react-router-dom";
import HeaderComp from "../header";



function CommonLayout() {

    return (
        <div className="flex flex-auto flex-col bg-white dark:bg-gray-950 min-h-screen">
            <div className="flex flex-auto">
                <main className="flex flex-col min-w-0 w-full bg-white dark:bg-gray-950 transition-colors duration-300 border-gray-300 dark:border-gray-800 min-h-screen">
                    <HeaderComp />
                    <div className="flex flex-auto flex-col justify-between h-[calc(100% - 64px)] bg-white dark:bg-gray-950">
                        <div className="h-full bg-white dark:bg-gray-950">
                            <div className="h-full flex flex-auto flex-col px-4 sm:px-6 md:px-6 py-4 sm:py-6 bg-white dark:bg-gray-950">
                                <div className="mx-auto container h-full p-0">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CommonLayout;