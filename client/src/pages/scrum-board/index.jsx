import CommonCard from "@/components/common-card";
import { PRIORITY_COLOR_MAP, scrumBoardOptions } from "@/config";
import { TaskManagerContext } from "@/context";
import { useContext, useEffect } from "react";
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
        setTaskList(Array.isArray(response?.data) ? response.data : []);
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
                <div className="max-w-lg w-full bg-gray-50 border rounded-2xl shadow-sm p-10 text-center">
                    <div className="text-4xl mb-4">🧩</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Your Scrum Board is empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Create tasks to organize them across To Do, In Progress, Review, and Done.
                    </p>
                    <button
                        onClick={() => navigate("/tasks/list")}
                        className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition"
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
        <div className="grid grid-cols-5 gap-2 h-full">
            {scrumBoardOptions.map(column => (
                <div
                    key={column.id}
                    className="border border-[#333333] rounded overflow-auto"
                    onDrop={e => onDrop(e, column.id)}
                    onDragOver={e => e.preventDefault()}
                >
                    <div className="px-1 py-3 text-center bg-black mb-3">
                        <h3 className="text-2xl font-extrabold text-white">
                            {column.label}
                        </h3>
                    </div>

                    <div className="p-3 min-h-[100px]">
                        {groupedTasks[column.id]}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ScrumBoardPage;
