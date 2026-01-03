import { TaskManagerContext } from "@/context";
import { callLogoutUserApi } from "@/services";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";



function HeaderComp() {

    const {user,setUser} = useContext(TaskManagerContext);
    const navigate = useNavigate();

    async function hadleLogout() {
        const response = await callLogoutUserApi();

        if(response?.success){
            setUser(null);
            navigate("/auth")
        }
    }
    
    return (
       <header className="  border-b  border-gray-200">
            <div className=" container mx-auto h-16">
                <div className="flex h-[64px] items-center w-full justify-between">
                    <div className="w-auto ">
                        <h2 className="">Welcome to Task Manager {user?.name}</h2>
                    </div>
                    <div className="flex gap-4">
                    <Link to={"/tasks/list"}><p className="text-black text-xl font-bold">Tasks</p></Link>
                    <Link to={"/tasks/scrum-board"}><p className="text-black text-xl font-bold ml-9 mr-3">Scrum Board</p></Link>
                    <Link to={"/tasks/info"}><p className="text-black text-xl font-bold ml-6">Color Pattern</p></Link>
                    <Link to={"/tasks/stats"}><p className="text-black text-xl font-bold ml-6">Stats</p></Link>
                    
                </div>
                <div>
                    <LogOut onClick={hadleLogout} color="#000" className="cursor-pointer " />
                </div>
                </div>
                
            </div>
       </header>
    )
}

export default HeaderComp;