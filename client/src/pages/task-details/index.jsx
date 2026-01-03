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
        <div className="max-w-4xl mx-auto px-6 py-8">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <CommonButton
                    buttonText="← Back"
                    onClick={() => navigate("/tasks/list")}
                />

                <div className="flex gap-3">
                    <CommonButton
                        buttonText="Edit"
                        onClick={handleEdit}
                    />
                    <CommonButton
                        buttonText="Delete"
                        onClick={handleDelete}
                    />
                </div>
            </div>

            {/* CARD */}
            <div
                className={`rounded-3xl p-8 shadow-xl transition
                ${isDone ? "bg-gray-100" : PRIORITY_COLOR_MAP[taskDetails.priority]}`}
            >
                {/* DONE BADGE */}
                {isDone && (
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-green-100 text-green-700 text-sm font-semibold">
                            ✅ Task Completed
                        </span>
                    </div>
                )}

                {/* TITLE */}
                <h1
                    className={`text-4xl font-bold mb-3
                    ${isDone ? "line-through text-gray-500" : "text-gray-900"}`}
                >
                    {taskDetails.title}
                </h1>

                {/* DESCRIPTION */}
                <p
                    className={`text-lg mb-6
                    ${isDone ? "text-gray-500" : "text-gray-700"}`}
                >
                    {taskDetails.description || "No description provided."}
                </p>

                {/* STATUS + PRIORITY */}
                <div className="flex gap-3 mb-6">
                    <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold">
                        Status: {taskDetails.status}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white border text-sm font-semibold">
                        Priority: {taskDetails.priority}
                    </span>
                </div>

                {/* 📅 DEADLINE */}
                {taskDetails.dueDate ? (
                    <div className="mt-4 flex items-center justify-center">
                        <span
                            className={`text-sm font-semibold px-4 py-2 rounded-full
                                    bg-white border shadow-sm mb-3
                                ${isDone ? "border-gray-400 text-gray-600" : "border-green-600 text-green-700"}`}
                        >
                            {isDone ? `🏁 Due was on: ${formatDate(taskDetails.dueDate)}` : `🏁 Due on: ${formatDate(taskDetails.dueDate)}`}
                        </span>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-sm font-semibold px-4 py-2 rounded-full
                             bg-white border border-gray-400 text-gray-600 shadow-sm mb-3">
                            ⛔ No Deadline Given
                        </span>
                    </div>
                )}


                {/* ✅ COMPLETION DATE */}
                {taskDetails.status === "done" && taskDetails.completedAt && (
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-sm font-semibold px-4 py-2 rounded-full
            bg-white border border-green-600 text-green-700 shadow-sm mb-3">
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
