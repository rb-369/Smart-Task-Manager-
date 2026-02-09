import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import CommonButton from "@/components/common-button";
import { useState } from "react";
import logo from "@/assets/logo5.png";

function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="flex flex-auto flex-col min-h-screen h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full max-w-md mx-auto">
                <div className="mb-8 text-center">
                    <img src={logo} alt="Smart Task Manager" className="mx-auto h-16 w-16 mb-4 rounded-full" />
                    {/* <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                        <span className="text-3xl">🚀</span>
                    </div> */}
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Welcome to <br />
                        <span className="text-blue-600 dark:text-blue-400">Smart Task Manager</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isLoginView
                            ? "Sign in to manage your tasks effectively"
                            : "Create an account to start your journey"}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 w-full border border-gray-200 dark:border-gray-700">
                    {isLoginView ? <SignIn /> : <SignUp />}

                    <div className="mt-6 flex items-center justify-center">
                        <div className="text-sm">
                            <button
                                onClick={() => setIsLoginView(!isLoginView)}
                                type="button"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                {isLoginView
                                    ? "Don't have an account? Sign up"
                                    : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AuthPage;