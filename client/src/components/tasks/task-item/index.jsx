import CommonButton from "@/components/common-button";
import CommonCard from "@/components/common-card";
import { PRIORITY_COLOR_MAP, scrumBoardOptions } from "@/config";
import TaskDetails from "@/pages/task-details";
import { useNavigate } from "react-router-dom";
import getDueStatus from "@/components/helper";


function TaskItem({ item, setShowDialog, handleDelete, setCurrentEditedId, taskFormData }) {

    const navigate = useNavigate();

    const isDone = item?.status === "done";

    const dueStatus = getDueStatus(item?.dueDate, item?.status);


    function handleNavigate(curId) {

        navigate(`/tasks/details/${curId}`);
    }
    return (
        <CommonCard
            title={item?.title}
            description={scrumBoardOptions.find(boardOption => boardOption.id === item?.status)?.label}
            color={PRIORITY_COLOR_MAP[item?.priority]}
            id={item?._id}
            wrapperClass={isDone ? "opacity-70 hover:opacity-80 transition-opacity" : ""}

            /* ✅ ONLY LINE-THROUGH WHEN DONE */
            extraTextStyles={isDone ? "line-through text-gray-500" : ""}

            footerContent={
                <div className="flex flex-col w-full gap-3">

                    {/* 🔔 STATUS / DUE BADGE */}
                    <div className="flex justify-center min-h-[28px]">

                        {/* ✅ DONE BADGE (highest priority) */}
                        {isDone && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold
                                    bg-white text-green-700
                                    border border-green-600
                                    shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                                ✅ Completed
                            </span>
                        )}

                        {/* ⏳ DUE BADGES (only when NOT done) */}
                        {!isDone && dueStatus?.type === "overdue" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-red-600 text-red-700 animate-pulseUrgent">
                                🔴 Overdue
                            </span>
                        )}

                        {!isDone && dueStatus?.type === "today" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-orange-500 text-orange-700 animate-pulseSlow">
                                ⏰ Due Today
                            </span>
                        )}

                        {!isDone && dueStatus?.type === "tomorrow" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-yellow-400 text-yellow-800">
                                ⏰ Due Tomorrow
                            </span>
                        )}

                        {!isDone && dueStatus?.type === "future" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-blue-400 text-blue-700">
                                📅 Due in {dueStatus.days} days
                            </span>
                        )}

                        {!isDone && !dueStatus && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                                ⛔ No deadline
                            </span>
                        )}
                        
                    </div>



                    {/* 🔘 ACTION BUTTONS */}
                    <div className="flex w-full justify-center items-center gap-3">
                        <CommonButton
                            buttonText={"Edit"}
                            onClick={() => {
                                setShowDialog(true);
                                setCurrentEditedId(item?._id);
                                taskFormData.setValue("title", item?.title);
                                taskFormData.setValue("description", item?.description);
                                taskFormData.setValue("status", item?.status);
                                taskFormData.setValue("priority", item?.priority);
                                taskFormData.setValue(
                                    "dueDate",
                                    item?.dueDate
                                        ? new Date(item.dueDate).toISOString().split("T")[0]
                                        : null
                                );
                            }}
                        />

                        <CommonButton
                            buttonText={"Details"}
                            onClick={() => handleNavigate(item?._id)}
                        />

                        <CommonButton
                            buttonText={"Delete"}
                            onClick={() => handleDelete(item?._id)}
                        />
                    </div>

                </div>
            }

        />
    )
}

export default TaskItem;