import Commonform from "@/components/common-form";
import { signUpFormControls } from "@/config";
import { toast, useToast } from "@/hooks/use-toast";
import { callRegisterUserApi } from "@/services";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TaskManagerContext } from "@/context";

function SignUp() {

    const { setUser } = useContext(TaskManagerContext);

    const formData = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
        mode: "onChange" // Validate on change for better UX
    })

    const { toast } = useToast();
    const navigate = useNavigate();
    
    async function handleSubmit(getData) {
        console.log(getData);

        try {
            const data = await callRegisterUserApi(getData);

            console.log(data, "data");
            
            if (data?.success) {
                setUser(data.data);   // ✅ VERY IMPORTANT
                console.log("User registered successfully");
                toast({
                    title: `User ${data?.data?.name} registered successfully`,
                    description: `Welcome '${data?.data?.name}'`
                })
                navigate("/tasks/list")
            } else {
                console.log("User registeration failed");
                toast({
                    title: "Error",
                    description: data?.message || "Something went wrong",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.log("Error:", error);
            toast({
                title: "Registration Failed",
                description: error?.response?.data?.message || "Unable to register. Please try again.",
                variant: "destructive"
            })
        }
    }
    
    return (
        <div>
            <h2>This is sign Up Page</h2>
            <Commonform 
                formControls={signUpFormControls} 
                btnText={"Sign Up"}
                form={formData}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}

export default SignUp;