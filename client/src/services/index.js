import axios from "axios"



export const callRegisterUserApi = async (formData) => {
    
    const response = await axios.post("http://localhost:5000/api/user/register",
        formData, 
        {withCredentials: true}
    );

    return response?.data;
}

export const callLoginUserApi = async (formData) => {
    
    const response = await axios.post("http://localhost:5000/api/user/login",
        formData,
        {withCredentials: true}
    );

    return response?.data;
}

export const callUserAuthApi = async () => {
    
    const response = await axios.post("http://localhost:5000/api/user/auth",{},
        {withCredentials: true}
    )

    return response?.data;
}

export const callLogoutUserApi = async () => {
    
    const response = await axios.post("http://localhost:5000/api/user/logout", {}, {withCredentials:true});

    return response?.data
}

export const addNewTaskApi = async (formData) => {
    
    const response = await axios.post("http://localhost:5000/api/tasks/add", formData);

    return response?.data
}

export const getAllTasksApi = async (CurUserId) => {
    
    const response = await axios.get(`http://localhost:5000/api/tasks/get/${CurUserId}`);

    return response?.data;
}

export const getSingleTasksApi = async (CurTaskId) => {
    
    const response = await axios.get(`http://localhost:5000/api/tasks/get-details/${CurTaskId}`);

    return response?.data;
}

export const updateTasksApi = async (formData) => {
    
    const response = await axios.put("http://localhost:5000/api/tasks/update", formData);

    return response?.data;
}

export const deleteTasksApi = async (CurTaskId) => {
    
    const response = await axios.delete(`http://localhost:5000/api/tasks/del/${CurTaskId}`);

    return response?.data;
}