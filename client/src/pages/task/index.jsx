import CommonButton from "@/components/common-button";
import AddNewTask from "@/components/tasks/add-new-task";
import TaskItem from "@/components/tasks/task-item";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskManagerContext } from "@/context";
import { getAllTasksApi, addNewTaskApi, deleteTasksApi, updateTasksApi } from "@/services";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



function TaskPage() {

    const [showDialog, setShowDialog] = useState(false);

    const location = useLocation();

    const { taskList, setTaskList, loading, setLoading, user, taskFormData, currentEditedId,
        setCurrentEditedId } = useContext(TaskManagerContext);

    // ✅ OPEN EDIT MODAL WHEN COMING FROM DETAILS
    useEffect(() => {
        if (location.state?.openEditModal) {
            setShowDialog(true);
        }
    }, [location.state]);

    const userId = user?._id;

    async function fetchListOfTasks() {
        setLoading(true);

        const response = await getAllTasksApi(userId);

        if (response?.success) {

            setTaskList(response?.data);
            setLoading(false);
        }

    }

    async function handleSubmit(getData) {

        const response = currentEditedId !== null ? await updateTasksApi({
            ...getData,
            _id: currentEditedId,
            userId: user?._id
        }) : await addNewTaskApi({
            ...getData,
            userId: user?._id
        });

        console.log(response);

        if (response) {

            fetchListOfTasks()
            setShowDialog(false);
            taskFormData.reset();
            setCurrentEditedId(null);
        }

    }

    async function handleDelete(getTaskId) {
        
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        const response = await deleteTasksApi(getTaskId);

        if (response?.success) {
            fetchListOfTasks();
        }
    }

    useEffect(() => {
    let isMounted = true;

    async function fetchListOfTasks() {
        if (!user?._id) return;

        setLoading(true);
        try {
            const response = await getAllTasksApi(user._id);

            if (!isMounted) return;

            if (response?.success) {
                setTaskList(Array.isArray(response.data) ? response.data : []);
            } else {
                setTaskList([]);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            if (isMounted) setTaskList([]);
        } finally {
            if (isMounted) setLoading(false);
        }
    }

    if (user?._id) {
        fetchListOfTasks();
    } else {
        // 🔥 user logged out / switched
        setTaskList([]);
        setLoading(false);
    }

    return () => {
        isMounted = false;
    };
}, [user?._id]);


    if (loading) {
        return <Skeleton className={"w-full h-[550px] rounded-[6px] bg-black opacity-50"} />
    }

    return (
        <Fragment>
            <div className="mb-5 ">
                <CommonButton
                    onClick={() => setShowDialog(true)}
                    buttonText={"Add New Task"} />
            </div>
            <div className="mt-5 flex flex-col">
                <h2 className="mb-4 text-2xl font-semibold">{taskList?.length > 0 ? (taskList?.length === 1 ? "1 task found" : `${taskList?.length} tasks found`) : "No tasks found Pls add one!"} </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                    {
                        taskList?.length > 0 ?
                            taskList.map(item => <TaskItem handleDelete={handleDelete}
                                item={item}
                                setShowDialog={setShowDialog}
                                setCurrentEditedId={setCurrentEditedId}
                                taskFormData={taskFormData}
                            />)
                            : <h1></h1>
                    }
                </div>
                <AddNewTask showDialog={showDialog}
                    handleSubmit={handleSubmit}
                    setShowDialog={setShowDialog}
                    taskFormData={taskFormData}
                    currentEditedId={currentEditedId}
                    setCurrentEditedId={setCurrentEditedId}
                />
            </div>

        </Fragment>
    )
}
export default TaskPage;