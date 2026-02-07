import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import CommonButton from "@/components/common-button";
import { useState } from "react";

function AuthPage() {

    const [isLoginView, setIsLoginView] = useState(false);
    
    return (
        <div className="flex flex-auto flex-col min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header Section with Logo and Title */}
            <div className="flex h-screen flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                {/* Logo and Branding Container */}
                <div className="w-full max-w-md mb-8 text-center">
                    {/* Logo Circle */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 1v2H5v4H3v2h2v6H3v2h2v4h4v2h2v-2h6v2h2v-2h4v-4h2v-2h-2V9h2V7h-2V3h-4V1h-2v2H9zm0 4h6v6H9V5zm8 0h4v4h-4V5zM5 9h4v4H5V9zm12 0h4v4h-4V9zM9 15h6v4H9v-4z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Title and Subtitle */}
                    <div className="space-y-2 mb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">TaskMaster</h1>
                        <p className="text-slate-300 text-lg font-medium">Organize • Plan • Execute</p>
                        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mt-4"></div>
                    </div>

                    {/* Welcome Text */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {isLoginView ? "Welcome Back" : "Get Started"}
                        </h3>
                        <p className="text-slate-300">
                            {isLoginView 
                                ? "Sign in to access your tasks and boost your productivity" 
                                : "Create an account to start managing your tasks efficiently"}
                        </p>
                    </div>

                    {/* Auth Form Container */}
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden mb-6">
                        <div className="p-8">
                            {isLoginView ? <SignIn /> : <SignUp />}
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <div className="flex flex-col gap-3">
                        <CommonButton 
                            onClick={() => setIsLoginView(!isLoginView)}
                            type={"button"} 
                            buttonText={isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            className="w-full"
                        />
                        <p className="text-xs text-slate-400 text-center">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AuthPage;