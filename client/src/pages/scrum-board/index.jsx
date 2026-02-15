import CommonCard from "@/components/common-card";
import { PRIORITY_COLOR_MAP, scrumBoardOptions } from "@/config";
import { TaskManagerContext } from "@/context";
import { useContext, useEffect, Fragment } from "react";
import { getAllTasksApi, updateTasksApi } from "@/services";
import { useNavigate } from "react-router-dom";

function ScrumBoardPage() {
    const { user, setTaskList, taskList, setLoading, loading } =
        useContext(TaskManagerContext);

    const navigate = useNavigate();
    const userId = user?._id;

    /* ✅ ALWAYS USE SAFE LIST */
    const safeTaskList = Array.isArray(taskList) ? taskList : [];

    /* ================= FETCH TASKS ================= */
    async function fetchListOfTasks() {
        setLoading(true);
        const response = await getAllTasksApi(userId);
        setTaskList(Array.isArray(response?.data) ? response.data : response?.data?.tasks || []);
        setLoading(false);
    }

    useEffect(() => {
        if (userId) fetchListOfTasks();
    }, [userId]);

    /* ================= DRAG & DROP ================= */
    function onDragStart(event, taskId) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", taskId);
    }

    async function updateTaskByStatus(updatedTask) {
        await updateTasksApi(updatedTask);
        await fetchListOfTasks();
    }

    function onDrop(event, newStatus) {
        event.preventDefault();

        const draggedTaskId = event.dataTransfer.getData("text/plain");
        if (!draggedTaskId) return;

        const currentTask = safeTaskList.find(
            task => task._id.toString() === draggedTaskId
        );

        if (!currentTask) return;

        updateTaskByStatus({
            _id: currentTask._id,
            status: newStatus,
            userId: currentTask.userId,
            priority: currentTask.priority,
            title: currentTask.title,
            description: currentTask.description,
        });
    }

    /* ================= GROUP TASKS ================= */
    function renderTaskByStatus() {
        const grouped = {
            todo: [],
            inProgress: [],
            blocked: [],
            review: [],
            done: [],
        };

        safeTaskList.forEach(task => {
            grouped[task.status]?.push(
                <CommonCard
                    key={task._id}
                    draggable
                    onDragStart={e => onDragStart(e, task._id)}
                    onDoubleClick={() => navigate(`/tasks/details/${task._id}`)}
                    title={task.title}
                    description={
                        scrumBoardOptions.find(opt => opt.id === task.status)?.label
                    }
                    extraTextStyles={
                        task.status === "done"
                            ? "line-through opacity-40 hover:opacity-60"
                            : ""
                    }
                    color={PRIORITY_COLOR_MAP[task.priority]}
                />
            );
        });

        return grouped;
    }

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <span className="text-lg text-gray-500">Loading Scrum Board…</span>
            </div>
        );
    }

    /* ================= EMPTY STATE ================= */
    if (safeTaskList.length === 0) {
        return (
            <div className="flex justify-center items-center h-[70vh] px-4">
                <div className="max-w-lg w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm p-10 text-center transition-colors">
                    <div className="text-4xl mb-4">🧩</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Your Scrum Board is empty
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create tasks to organize them across To Do, In Progress, Review, and Done.
                    </p>
                    <button
                        onClick={() => navigate("/tasks/list")}
                        className="px-6 py-2 rounded-lg bg-black dark:bg-blue-600 text-white font-semibold hover:bg-gray-900 dark:hover:bg-blue-500 transition"
                    >
                        Add your first task
                    </button>
                </div>
            </div>
        );
    }

    /* ================= SCRUM BOARD ================= */
    const groupedTasks = renderTaskByStatus();

    return (
        <Fragment>
            <h1 className="text-3xl font-bold tracking-tight mb-8 text-gray-900 dark:text-gray-100 pl-2">
                Scrum Board
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 h-full pb-6 px-2">
                {scrumBoardOptions.map(column => (
                    <div
                        key={column.id}
                        className="flex flex-col rounded-xl bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-full max-h-[calc(100vh-160px)] shadow-sm dark:shadow-none"
                        onDrop={e => onDrop(e, column.id)}
                        onDragOver={e => e.preventDefault()}
                    >
                        {/* Column Header */}
                        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-t-xl sticky top-0 z-10 transition-colors">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                {column.label}
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                {groupedTasks[column.id]?.length || 0}
                            </span>
                        </div>

                        {/* Tasks Container */}
                        <div className="p-4 flex-1 overflow-y-auto min-h-[150px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                            {groupedTasks[column.id]}
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    );
}

export default ScrumBoardPage;
