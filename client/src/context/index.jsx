import { callUserAuthApi } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";


export const TaskManagerContext = createContext(null);


function TaskManagerProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(false);

    const [taskList, setTaskList] = useState([]);

    const [currentEditedId, setCurrentEditedId] = useState(null);

    const [taskDetails, setTaskDetails] = useState(null);

    const taskFormData = useForm({
        defaultValues: {
            title: "",
            description: "",
            status: "todo",
            priority: "medium",
            dueDate: null
        }
    })
    const navigate = useNavigate();
    const location = useLocation();

// useEffect(() => {
//     const verifyUserCookie = async () => {
//         const data = await callUserAuthApi();

//         if (data?.success && data?.curUserInfo) {
//             setUser(data.curUserInfo);

//             // ✅ Only redirect when on auth or root
//             if (location.pathname === "/auth" || location.pathname === "/") {
//                 navigate("/tasks/list");
//             }
//         } else {
//             navigate("/auth");
//         }
//     };

//     verifyUserCookie();
// }, [navigate, location.pathname]);

useEffect(() => {
    const verifyUserCookie = async () => {
        try {
            const data = await callUserAuthApi();

            if (data?.success && data?.curUserInfo) {
                setUser(data.curUserInfo);

                if (location.pathname === "/auth" || location.pathname === "/") {
                    navigate("/tasks/list");
                }
            } else {
                // 🔴 only force auth page if user tries protected route
                if (location.pathname.startsWith("/tasks")) {
                    navigate("/auth");
                }
            }

        } catch (err) {
            if (location.pathname.startsWith("/tasks")) {
                navigate("/auth");
            }
        }
    };

    verifyUserCookie();
}, [location.pathname]);


    return <TaskManagerContext.Provider value={{
        user,
        setUser,
        taskFormData,
        taskList,
        setTaskList,
        loading,
        setLoading,
        currentEditedId,
        setCurrentEditedId,
        setTaskDetails,
        taskDetails
    }}>{children}</TaskManagerContext.Provider>
}

export default TaskManagerProvider;