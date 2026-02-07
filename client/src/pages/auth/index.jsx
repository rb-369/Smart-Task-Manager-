import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import CommonButton from "@/components/common-button";
import { useState } from "react";

function AuthPage() {

    const [isLoginView, setIsLoginView] = useState(false);
    
    return (
        <div className="flex flex-auto flex-col min-h-screen h-full">
            <div className="flex h-full flex-col justify-center items-center bg-white">
                <h3 className="text-3xl font-bold">Welcome</h3>
            </div>
            <div className="mt-4 mb-4">
                {
                    isLoginView? <SignIn/>:<SignUp/>
                }
            </div>
           <div className="mt-5">
             <CommonButton onClick={()=>setIsLoginView(!isLoginView)}
            type={"button"} 
            buttonText={isLoginView? "Switch to Sign up": "Switch to Sign in"}
            />
           </div>
                
            
        </div>
    )
}
export default AuthPage;