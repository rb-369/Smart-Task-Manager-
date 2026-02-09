import { TaskManagerContext } from "@/context";
import { getSingleTasksApi, deleteTasksApi } from "@/services";
import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRIORITY_COLOR_MAP } from "@/config";
import CommonButton from "@/components/common-button";
import { formatDate } from "@/components/helper";
import { getCompletionTiming } from "@/components/helper";



function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        taskDetails,
        setTaskDetails,
        loading,
        setLoading,
        taskFormData,
        setCurrentEditedId
    } = useContext(TaskManagerContext);

    useEffect(() => {
        let isMounted = true;

        async function fetchTaskDetails() {
            if (!id) return;

            setLoading(true);
            try {
                const response = await getSingleTasksApi(id);

                if (!isMounted) return;

                if (response?.success) {
                    setTaskDetails(response.data);
                } else {
                    setTaskDetails(null);
                }
            } catch (error) {
                console.error("Failed to fetch task details:", error);
                if (isMounted) setTaskDetails(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchTaskDetails();

        return () => {
            isMounted = false;
            setTaskDetails(null); // 🔥 clear old task
        };
    }, [id]);




    function handleEdit() {
        setCurrentEditedId(taskDetails._id);

        taskFormData.setValue("title", taskDetails.title);
        taskFormData.setValue("description", taskDetails.description);
        taskFormData.setValue("status", taskDetails.status);
        taskFormData.setValue("priority", taskDetails.priority);
        taskFormData.setValue(
            "dueDate",
            taskDetails.dueDate
                ? new Date(taskDetails.dueDate).toISOString().split("T")[0]
                : null
        );


        navigate("/tasks/list", {
            state: { openEditModal: true }
        });
    }

    async function handleDelete() {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        const response = await deleteTasksApi(id);
        if (response?.success) {
            navigate("/tasks/list");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <h2 className="text-xl font-semibold">Loading task details…</h2>
            </div>
        );
    }

    if (!taskDetails) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <h2 className="text-xl font-semibold text-gray-500">
                    No task found
                </h2>
            </div>
        );
    }

    const isDone = taskDetails.status === "done";

    //     const completionStatus =
    //   isDone && taskDetails.dueDate && taskDetails.updatedAt
    //     ? getCompletionTiming(taskDetails.dueDate, taskDetails.updatedAt)
    //     : null;

    let completionStatus = null;

    if (isDone && taskDetails.completedAt) {
        completionStatus = getCompletionTiming(
            taskDetails.dueDate,
            taskDetails.completedAt
        );
    }




    return (
        <div className="max-w-4xl mx-auto px-6 py-8 ">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/tasks/list")}
                    className="h-10 px-4 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-blue-600 dark:to-blue-700 text-white font-bold rounded-lg hover:from-gray-800 hover:to-gray-900 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    ← Back
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleEdit}
                        className="h-10 px-6 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-10 px-6 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* CARD */}
            <div
                className={`rounded-3xl p-8 shadow-xl transition
                ${isDone
                        ? "bg-gray-100 dark:bg-gray-900 border border-transparent dark:border-gray-800"
                        : PRIORITY_COLOR_MAP[taskDetails.priority]}`}
            >
                {/* DONE BADGE */}
                {isDone && (
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-transparent dark:border-green-800">
                            ✅ Task Completed
                        </span>
                    </div>
                )}

                {/* TITLE */}
                <h1
                    className={`text-4xl font-bold mb-3
                    ${isDone ? "line-through text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}
                >
                    {taskDetails.title}
                </h1>

                {/* DESCRIPTION */}
                <p
                    className={`text-lg mb-6
                    ${isDone ? "text-gray-500 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
                >
                    {taskDetails.description || "No description provided."}
                </p>

                {/* STATUS + PRIORITY */}
                <div className="flex gap-3 mb-6">
                    <span className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold">
                        Status: {taskDetails.status}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white dark:bg-gray-700 border dark:border-gray-600 text-sm font-semibold text-gray-800 dark:text-gray-100 uppercase">
                        Priority: {taskDetails.priority}
                    </span>
                </div>

                {/* 📅 DEADLINE */}
                {taskDetails.dueDate ? (
                    <div className="mt-4 flex items-center justify-center">
                        <span
                            className={`text-sm font-semibold px-4 py-2 rounded-full
                                    border shadow-sm mb-3
                                ${isDone
                                    ? "bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                                    : "bg-white dark:bg-gray-800 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400"}`}
                        >
                            {isDone ? `🏁 Due was on: ${formatDate(taskDetails.dueDate)}` : `🏁 Due on: ${formatDate(taskDetails.dueDate)}`}
                        </span>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-sm font-semibold px-4 py-2 rounded-full
                             bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 shadow-sm mb-3">
                            ⛔ No Deadline Given
                        </span>
                    </div>
                )}


                {/* ✅ COMPLETION DATE */}
                {taskDetails.status === "done" && taskDetails.completedAt && (
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-sm font-semibold px-4 py-2 rounded-full
            bg-white dark:bg-gray-800 border border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 shadow-sm mb-3">
                            🏁 Completed on: {formatDate(taskDetails.completedAt)}
                        </span>
                    </div>
                )}


                {completionStatus && (
                    <div className="mt-3 flex justify-center">
                        {completionStatus === "early" && (
                            <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold">
                                🏆 Completed Early
                            </span>
                        )}

                        {completionStatus === "onTime" && (
                            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold">
                                ⏱ Completed On Time
                            </span>
                        )}

                        {completionStatus === "late" && (
                            <span className="px-4 py-2 rounded-full bg-red-100 text-red-800 font-semibold">
                                🔴 Completed Late
                            </span>
                        )}

                    </div>
                )}

                {/* META */}
                <div className="text-sm text-gray-600 border-t pt-4">
                    Task ID: {taskDetails._id}
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;
