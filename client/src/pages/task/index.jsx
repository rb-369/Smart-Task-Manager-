import CommonButton from "@/components/common-button";
import AddNewTask from "@/components/tasks/add-new-task";
import TaskItem from "@/components/tasks/task-item";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskManagerContext } from "@/context";
import { getAllTasksApi, addNewTaskApi, deleteTasksApi, updateTasksApi } from "@/services";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



import SearchFilterBar from "@/components/tasks/search-filter-bar";

function TaskPage() {

    const [showDialog, setShowDialog] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [filterPriority, setFilterPriority] = useState("all");

    const location = useLocation();

    const { taskList, setTaskList, loading, setLoading, user, taskFormData, currentEditedId,
        setCurrentEditedId } = useContext(TaskManagerContext);

    // ... (keep useEffects) ...

    async function fetchListOfTasks() {
        setLoading(true);
        const response = await getAllTasksApi(user?._id);

        if (response?.success) {
            setTaskList(response?.data);
        }
        setLoading(false);
    }

    async function handleSubmit(data) {
        const response = currentEditedId !== null ?
            await updateTasksApi({
                ...data,
                _id: currentEditedId,
                userId: user?._id
            }) :
            await addNewTaskApi({
                ...data,
                userId: user?._id
            });

        if (response?.success) {
            fetchListOfTasks();
            setShowDialog(false);
            taskFormData.reset();
            setCurrentEditedId(null);
        }
    }

    async function handleDelete(getTaskId) {
        const response = await deleteTasksApi(getTaskId);

        if (response?.success) {
            fetchListOfTasks();
        }
    }

    useEffect(() => {
        if (user !== null) fetchListOfTasks()
    }, [user])

    // FILTER & SORT LOGIC
    const filteredTasks = Array.isArray(taskList) ? taskList.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

        return matchesSearch && matchesPriority;
    }).sort((a, b) => {
        switch (sortBy) {
            case "priority-high":
                const priorityMap = { high: 3, medium: 2, low: 1 };
                return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
            case "priority-low":
                const pMap = { high: 3, medium: 2, low: 1 };
                return (pMap[a.priority] || 0) - (pMap[b.priority] || 0);
            case "due-date":
                // Sort by due date (earliest first). Tasks without due date go last.
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            case "status":
                return (a.status || "").localeCompare(b.status || "");
            default:
                // Default is usually by creation date (newest first) which is logic from backend
                // Since .sort() mutates, we need to be careful if we didn't filter.
                // But .filter() returns a new array, so we can sort it.
                return 0;
        }
    }) : [];

    if (loading) {
        return <Skeleton className={"w-full h-[550px] rounded-[6px] bg-black opacity-50"} />
    }

    return (
        <Fragment>
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                <button
                    onClick={() => setShowDialog(true)}
                    className="h-10 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                >
                    Add New Task
                </button>
            </div>

            {/* Search & Filter Bar */}
            <SearchFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                sortBy={sortBy} setSortBy={setSortBy}
                filterPriority={filterPriority} setFilterPriority={setFilterPriority}
            />

            <div className="mt-5 flex flex-col">
                <h2 className="mb-4 text-xl font-semibold text-gray-600 dark:text-gray-400">
                    {filteredTasks.length > 0 ?
                        (filteredTasks.length === 1 ? "1 task found" : `${filteredTasks.length} tasks found`)
                        : "No tasks match your filters"}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        filteredTasks.length > 0 ?
                            filteredTasks.map(item => <TaskItem
                                key={item._id}
                                handleDelete={handleDelete}
                                item={item}
                                setShowDialog={setShowDialog}
                                setCurrentEditedId={setCurrentEditedId}
                                taskFormData={taskFormData}
                            />)
                            : <div className="col-span-full text-center py-10 text-gray-500">
                                <p>No tasks found matching your search.</p>
                            </div>
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