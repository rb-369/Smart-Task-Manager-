import { TaskManagerContext } from "@/context";
import { getAllTasksApi } from "@/services";
import { Fragment, useContext, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { getCompletionTiming } from "@/components/helper";

function StatsPage() {
    const { user, taskList, setTaskList, loading, setLoading } =
        useContext(TaskManagerContext);

    const userId = user?._id;

    useEffect(() => {
        let isMounted = true;

        async function fetchListOfTasks() {
            setLoading(true);
            try {
                const response = await getAllTasksApi(userId);

                if (!isMounted) return;

                if (response?.success) {
                    setTaskList(Array.isArray(response.data) ? response.data : []);
                } else {
                    setTaskList([]); // 🔥 important
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                if (isMounted) {
                    setTaskList([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false); // 🔥 ALWAYS runs
                }
            }
        }

        if (userId) {
            fetchListOfTasks();
        } else {
            // 🔥 user logged out / switched
            setTaskList([]);
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [userId]);


    /* ================= SAFE LIST ================= */
    const safeTaskList = Array.isArray(taskList) ? taskList : [];

    /* ================= COUNTS ================= */
    const totalTasks = safeTaskList.length;

    const todoTasksCount = safeTaskList.filter(t => t.status === "todo").length;
    const inProgressTaskCount = safeTaskList.filter(t => t.status === "inProgress").length;
    const reviewTasksCount = safeTaskList.filter(t => t.status === "review").length;
    const blockedTasksCount = safeTaskList.filter(t => t.status === "blocked").length;
    const completedTasksCount = safeTaskList.filter(t => t.status === "done").length;

    const completedTasks = safeTaskList.filter(
        t => t.status === "done" && t.updatedAt
    );

    /* ================= COMPLETION COUNTS (FIXED) ================= */

    let completedEarlyCount = 0;
    let completedOnTimeCount = 0;
    let completedLateCount = 0;

    completedTasks.forEach(task => {
        const timing = getCompletionTiming(task.dueDate, task.updatedAt);

        if (timing === "early") completedEarlyCount++;
        if (timing === "onTime") completedOnTimeCount++;
        if (timing === "late") completedLateCount++;
    });

    /* ================= STREAK LOGIC (100% CORRECT) 🔥 ================= */

    // Use completedAt ONLY
    const completedTasksWithDate = safeTaskList.filter(
        t => t.status === "done" && t.completedAt
    );

    // Build a SET of normalized day timestamps (midnight)
    const completedDaySet = new Set(
        completedTasksWithDate.map(task => {
            const d = new Date(task.completedAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        })
    );

    // ===== CURRENT STREAK (STRICT, TODAY-ONLY START) =====
    let onTimeStreak = 0;

    // normalize today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔴 IMPORTANT: if today is NOT completed → streak = 0
    if (completedDaySet.has(today.getTime())) {
        onTimeStreak = 1;

        let cursor = new Date(today);
        cursor.setDate(cursor.getDate() - 1);

        while (true) {
            const prevDay = new Date(cursor);
            prevDay.setDate(prevDay.getDate() - 1);

            if (
                completedDaySet.has(prevDay.getTime()) &&
                cursor.getTime() - prevDay.getTime() === 86400000
            ) {
                onTimeStreak++;
                cursor = prevDay;
            } else {
                break;
            }
        }

    }

    // ===== LONGEST STREAK (historical) =====
    const completedDays = [...completedDaySet].sort((a, b) => a - b);

    let longestOnTimeStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < completedDays.length; i++) {
        if (i === 0 || completedDays[i] - completedDays[i - 1] === 86400000) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        longestOnTimeStreak = Math.max(longestOnTimeStreak, currentStreak);
    }





    /* ================= COMPLETION % ================= */
    const completionPercent =
        totalTasks > 0
            ? Math.round((completedTasksCount / totalTasks) * 100)
            : 0;


    /* ============On time Completion================ */

    const onTimeCompletionPercent =
        completedTasksCount > 0
            ? Math.round((completedOnTimeCount / completedTasksCount) * 100)
            : 0;

    /* ========Before time completion================= */

    const beforeTimeCompletionPercent =
        completedTasksCount > 0
            ? Math.round((completedEarlyCount / completedTasksCount) * 100)
            : 0;

    /* ========Late completion================= */

    const lateCompletionPercent =
        completedTasksCount > 0
            ? Math.round((completedLateCount / completedTasksCount) * 100)
            : 0;



    /* ================= CHART DATA ================= */
    const statusChartData = [
        { name: "Todo", value: todoTasksCount },
        { name: "In Progress", value: inProgressTaskCount },
        { name: "Review", value: reviewTasksCount },
        { name: "Blocked", value: blockedTasksCount },
        { name: "Done", value: completedTasksCount },
    ];

    const completionTimingData = [
        { name: "Early", value: completedEarlyCount },
        { name: "On Time", value: completedOnTimeCount },
        { name: "Late", value: completedLateCount },
    ];

    const statusColors = ["#60A5FA", "#3B82F6", "#A855F7", "#F87171", "#34D399"];
    const timingColors = ["#22C55E", "#3B82F6", "#EF4444"];

    /* ================= WEEKLY ANALYTICS 📅 ================= */
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
    }).reverse();

    const weeklyCompletionData = last7Days.map(date => {
        const count = completedTasks.filter(task => {
            const completed = new Date(task.completedAt);
            completed.setHours(0, 0, 0, 0);
            return completed.getTime() === date.getTime();
        }).length;

        return {
            name: date.toLocaleDateString("en-IN", { weekday: "short" }),
            value: count,
        };
    });
    //eg
    /* ================= MONTHLY ANALYTICS 📆 ================= */
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyBuckets = {};

    completedTasks.forEach(task => {
        const d = new Date(task.completedAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            const week = Math.ceil(d.getDate() / 7);
            const key = `Week ${week}`;
            monthlyBuckets[key] = (monthlyBuckets[key] || 0) + 1;
        }
    });

    const monthlyCompletionData = Object.keys(monthlyBuckets).map(key => ({
        name: key,
        value: monthlyBuckets[key],
    }));



    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <h2 className="text-xl font-semibold text-gray-600">
                    Loading statistics…
                </h2>
            </div>
        );
    }

    if (totalTasks === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh] px-4">
                <div className="max-w-md w-full bg-gray-50 border rounded-2xl shadow-sm p-8 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        No statistics yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add tasks to start tracking progress, completion trends, and productivity.
                    </p>

                    <button
                        onClick={() => window.location.href = "/tasks/list"}
                        className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition"
                    >
                        Go to Tasks
                    </button>
                </div>
            </div>
        );
    }


    return (
        <Fragment>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">

                <h1 className="text-4xl font-bold">
                    Task Analytics Dashboard
                </h1>

                {/* ===== TOP STATS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                    <StatCard title="Total Tasks" value={totalTasks} dark />
                    <StatCard title="Todo" value={todoTasksCount} color="blue" />
                    <StatCard title="In Progress" value={inProgressTaskCount} color="indigo" />
                    <StatCard title="In Review" value={reviewTasksCount} color="purple" />
                    <StatCard title="Blocked" value={blockedTasksCount} color="red" />
                    <StatCard title="Completed" value={completedTasksCount} color="green" />
                </div>

                {/* ===== QUALITY + STREAK ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <StatCard title="Completed Early" value={completedEarlyCount} color="green" />
                    <StatCard title="Completed On Time" value={completedOnTimeCount} color="blue" />
                    <StatCard title="Completed Late" value={completedLateCount} color="red" />
                    <div className="rounded-2xl p-6 bg-gradient-to-br from-green-100 to-green-50 border shadow flex items-center justify-center font-semibold text-green-800">
                        🔥Streak: {onTimeStreak} {onTimeStreak === 1 ? "day" : (onTimeStreak === 0 ? "" : "days")}
                    </div>
                </div>

                {/* ===== PROGRESS ===== */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Completion Progress</h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-green-500 h-4 transition-all"
                            style={{ width: `${completionPercent}%` }}
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        {completionPercent}% tasks completed
                    </p>
                </div>

                {/* ===== CHARTS GRID ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* BAR */}
                    <ChartCard title="Task Status Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusChartData}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#111827" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* PIE */}
                    <ChartCard title="Task Breakdown (Circular)">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={statusChartData} dataKey="value" outerRadius={110} label>
                                    {statusChartData.map((_, i) => (
                                        <Cell key={i} fill={statusColors[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* DONUT */}
                    <ChartCard title="Completion Timing">
                        {completedTasksCount === 0 ? (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center text-gray-500">
                                <div className="text-4xl mb-2">⏳</div>
                                <p className="font-semibold">No tasks completed yet</p>
                                <p className="text-sm mt-1">
                                    Complete tasks to see timing analytics
                                </p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={completionTimingData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        label
                                    >
                                        {completionTimingData.map((_, i) => (
                                            <Cell key={i} fill={timingColors[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>


                    {/* Weekly Analytics */}
                    <ChartCard title="📅 Tasks Completed (Last 7 Days)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyCompletionData}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Monthly Analytics */}

                    <ChartCard title="📆 Monthly Completion Trend">
                        {monthlyCompletionData.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                No tasks completed this month
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyCompletionData}>
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>


                    {/* SUMMARY */}
                    <ChartCard title="📈 Productivity Summary">
                        <div className="space-y-4 text-sm">
                            <SummaryRow label="Tasks Completed" value={completedTasksCount} color="green" />
                            <SummaryRow
                                label="On-time Completion"
                                value={`${onTimeCompletionPercent}%`}
                                color="blue"
                            />
                            <SummaryRow
                                label="Before-Time Completion"
                                value={`${beforeTimeCompletionPercent}%`}
                                color="blue"
                            />
                            <SummaryRow
                                label="Late Completion"
                                value={`${lateCompletionPercent}%`}
                                color="blue"
                            />
                            <SummaryRow label="Tasks Pending" value={totalTasks - completedTasksCount} color="green" />
                            <SummaryRow label="Late Tasks" value={completedLateCount} color="red" />
                            <div className="pt-4 border-t flex justify-between font-semibold">
                                <span>🔥 Current Streak</span>
                                <span className="text-green-700">{onTimeStreak} {onTimeStreak === 1 ? "day" : (onTimeStreak === 0 ? "" : "days")}</span>
                            </div>
                            <div className="pt-4 border-t flex justify-between font-semibold">
                                <span>🔥🔥Longest Streak</span>
                                <span className="text-green-700">{longestOnTimeStreak} {longestOnTimeStreak == 1 ? "day" : "days"}</span>
                            </div>
                        </div>
                    </ChartCard>

                </div>
            </div>
        </Fragment>
    );
}

/* ===== SMALL COMPONENTS ===== */

function ChartCard({ title, children }) {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {children}
        </div>
    );
}

function SummaryRow({ label, value, color }) {
    const map = {
        green: "text-green-700",
        blue: "text-blue-700",
        red: "text-red-600",
    };
    return (
        <div className="flex justify-between">
            <span className="text-gray-600">{label}</span>
            <span className={`font-bold ${map[color]}`}>{value}</span>
        </div>
    );
}

function StatCard({ title, value, color, dark }) {
    if (dark) {
        return (
            <div className="rounded-2xl p-6 bg-gray-900 text-white shadow">
                <h3 className="text-sm uppercase text-gray-300">{title}</h3>
                <p className="text-4xl font-bold mt-2">{value}</p>
            </div>
        );
    }

    const colorMap = {
        blue: "bg-blue-100 text-blue-800 border-blue-300",
        indigo: "bg-indigo-100 text-indigo-800 border-indigo-300",
        purple: "bg-purple-100 text-purple-800 border-purple-300",
        red: "bg-red-100 text-red-800 border-red-300",
        green: "bg-green-100 text-green-800 border-green-300",
    };

    return (
        <div className={`rounded-2xl p-6 border shadow ${colorMap[color]}`}>
            <h3 className="text-sm uppercase">{title}</h3>
            <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
    );
}

export default StatsPage;
