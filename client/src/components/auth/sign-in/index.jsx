import Commonform from "@/components/common-form";
import { signInFormControls } from "@/config";
import { callLoginUserApi } from "@/services";
import { useForm } from "react-hook-form";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";



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
    
    return (
        <div>
            <h2>This is sign in Page</h2>
            <Commonform 
                formControls={signInFormControls}
                btnText={"Sign In"}
                form={formData}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}

export default SignIn;