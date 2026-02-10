import Commonform from "@/components/common-form";
import { signInFormControls } from "@/config";
import { callLoginUserApi, callGoogleOAuthApi } from "@/services";
import { useForm } from "react-hook-form";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TaskManagerContext } from "@/context";
import { GoogleLogin } from "@react-oauth/google";





function SignIn() {

    const { setUser } = useContext(TaskManagerContext);


    const formData = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange" // Validate on change for better UX
    })

    const { toast } = useToast();
    const navigate = useNavigate();    

    async function handleSubmit(getData) {
        try {
            const data = await callLoginUserApi(getData);

            console.log(data, "data");

            if (data?.success) {

                setUser(data.data);   // ✅ VERY IMPORTANT
                
                console.log("User Logged successfully");
                toast({
                    title: `User ${data?.data?.name} logged in successfully`,
                    description: `Welcome '${data?.data?.name}'`
                })
                navigate("/tasks/list")
            } else {
                console.log("User Login failed");
                toast({
                    title: "Error",
                    description: data?.message || "Something went wrong",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.log("Error:", error);
            toast({
                title: "Login Failed",
                description: error?.response?.data?.message || "Invalid email or password",
                variant: "destructive"
            })
        }
    }    

    // Handle Google OAuth Success
    const handleGoogleOAuthSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const data = await callGoogleOAuthApi(credential);

            if (data?.success) {
                setUser(data.data);
                toast({
                    title: `User ${data?.data?.name} logged in successfully`,
                    description: `Welcome '${data?.data?.name}'`
                })
                navigate("/tasks/list")
            } else {
                toast({
                    title: "Google Login Failed",
                    description: data?.message || "Something went wrong",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.log("Google OAuth Error:", error);
            toast({
                title: "Google Login Failed",
                description: error?.response?.data?.message || "Unable to login with Google",
                variant: "destructive"
            })
        }
    }

    const handleGoogleOAuthError = () => {
        toast({
            title: "Google Login Failed",
            description: "Failed to login with Google. Please try again.",
            variant: "destructive"
        })
    }
    return (
        <div>
            <h2>This is sign in Page</h2>
            <Commonform 
                formControls={signInFormControls}
                btnText={"Sign In"}
                form={formData}
                handleSubmit={handleSubmit}
            />
            
            <div className="mt-6 flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleOAuthSuccess}
                    onError={handleGoogleOAuthError}
                    text="signin"
                />
            </div>
        </div>
    )
}

export default SignIn;