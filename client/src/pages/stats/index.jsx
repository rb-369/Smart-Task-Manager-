import { TaskManagerContext } from "@/context";
import { getAllTasksApi } from "@/services";
import { Fragment, useContext, useEffect, useState } from "react";
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
    Legend
} from "recharts";
import { getCompletionTiming } from "@/components/helper";
import { Activity, CheckCircle, Clock, TrendingUp, AlertCircle, Calendar } from "lucide-react";

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
                    setTaskList([]);
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                if (isMounted) {
                    setTaskList([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        if (userId) {
            fetchListOfTasks();
        } else {
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

    // ===== CURRENT STREAK (STRICT, TODAY/YESTERDAY START) =====
    let onTimeStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Determines where the streak "starts" counting backwards from
    let streakCursor = null;

    if (completedDaySet.has(today.getTime())) {
        onTimeStreak = 1;
        streakCursor = yesterday;
    } else if (completedDaySet.has(yesterday.getTime())) {
        onTimeStreak = 1;
        streakCursor = new Date(yesterday);
        streakCursor.setDate(streakCursor.getDate() - 1);
    }

    if (streakCursor) {
        while (true) {
            if (
                completedDaySet.has(streakCursor.getTime())
            ) {
                onTimeStreak++;
                streakCursor.setDate(streakCursor.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // ===== LONGEST STREAK (historical) =====
    const completedDays = [...completedDaySet].sort((a, b) => a - b);
    let longestOnTimeStreak = 0;
    let currentCalcStreak = 0;

    for (let i = 0; i < completedDays.length; i++) {
        if (i === 0 || completedDays[i] - completedDays[i - 1] === 86400000) {
            currentCalcStreak++;
        } else {
            // Days are not consecutive, start a new streak
            currentCalcStreak = 1;
        }
        longestOnTimeStreak = Math.max(longestOnTimeStreak, currentCalcStreak);
    }

    /* ================= NEW STAT: AVG TASKS/DAY ================= */
    // Estimate based on range from first completed task to today
    let avgTasksPerDay = 0;
    if (completedDays.length > 0) {
        const firstDay = completedDays[0];
        const dayDiff = Math.max(1, Math.ceil((today.getTime() - firstDay) / (1000 * 60 * 60 * 24)));
        avgTasksPerDay = (completedTasksCount / dayDiff).toFixed(1);
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
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                        Loading measurements...
                    </h2>
                </div>
            </div>
        );
    }

    if (totalTasks === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh] px-4">
                <div className="max-w-md w-full bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-lg p-8 text-center transition-all hover:scale-105 duration-300">
                    <div className="text-6xl mb-6">📊</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        No statistics yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Add tasks to start tracking progress, completion trends, and productivity.
                    </p>

                    <button
                        onClick={() => window.location.href = "/tasks/list"}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1"
                    >
                        Go to Tasks
                    </button>
                </div>
            </div>
        );
    }


    return (
        <Fragment>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-4">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Overview of your productivity and task completion stats
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* ===== TOP STATS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Tasks"
                        value={totalTasks}
                        icon={<Activity className="h-5 w-5" />}
                        gradient="from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800"
                        textColor="text-white"
                    />
                    <StatCard
                        title="Todo"
                        value={todoTasksCount}
                        color="blue"
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgressTaskCount}
                        color="indigo"
                        icon={<Clock className="h-4 w-4" />}
                    />
                    <StatCard
                        title="In Review"
                        value={reviewTasksCount}
                        color="purple"
                    />
                    <StatCard
                        title="Blocked"
                        value={blockedTasksCount}
                        color="red"
                        icon={<AlertCircle className="h-4 w-4" />}
                    />
                    <StatCard
                        title="Completed"
                        value={completedTasksCount}
                        color="green"
                        icon={<CheckCircle className="h-4 w-4" />}
                    />
                </div>

                {/* ===== QUALITY + STREAK ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Completed Early" value={completedEarlyCount} color="green" suffix="Tasks" />
                    <StatCard title="Completed On Time" value={completedOnTimeCount} color="blue" suffix="Tasks" />
                    <StatCard title="Completed Late" value={completedLateCount} color="red" suffix="Tasks" />

                    <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg transform transition hover:scale-105 duration-300">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                            <h3 className="text-sm font-bold uppercase tracking-wider opacity-90 mb-1">Current Streak</h3>
                            <div className="text-5xl font-black flex items-center gap-2">
                                <span className="animate-pulse">🔥</span>
                                {onTimeStreak}
                            </div>
                            <p className="text-sm font-medium opacity-90 mt-1">
                                {onTimeStreak === 1 ? "Day" : "Days"} on fire!
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transform transition hover:scale-105 duration-300">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                            <div className="absolute top-4 right-4 opacity-50"><Activity className="h-5 w-5" /></div>
                            <h3 className="text-sm font-bold uppercase tracking-wider opacity-90 mb-1">Avg. Tasks/Day</h3>
                            <div className="text-4xl font-black flex items-center gap-2">
                                {avgTasksPerDay}
                            </div>
                            <p className="text-sm font-medium opacity-90 mt-1">
                                Lifetime Average
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== PROGRESS ===== */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-end mb-3">
                        <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Completion Progress
                        </h2>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {completionPercent}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-4 transition-all duration-1000 ease-out rounded-full relative"
                            style={{ width: `${completionPercent}%` }}
                        >
                            <div className="absolute top-0 right-0 h-full w-full bg-white opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* ===== CHARTS GRID ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* BAR */}
                    <ChartCard title="Task Status Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusChartData}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--foreground)'
                                    }}
                                    cursor={{ fill: 'var(--muted)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={statusColors[index % 20]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* PIE - Status Breakdown */}
                    <ChartCard title="Task Status Breakdown">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    dataKey="value"
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={2}
                                >
                                    {statusChartData.map((_, i) => (
                                        <Cell key={i} fill={statusColors[i]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: 'var(--chart-text)' }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* NEW: Priority Breakdown */}
                    <ChartCard title="Tasks by Priority">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Low', value: safeTaskList.filter(t => t.priority === 'low').length },
                                        { name: 'Medium', value: safeTaskList.filter(t => t.priority === 'medium').length },
                                        { name: 'High', value: safeTaskList.filter(t => t.priority === 'high').length },
                                    ]}
                                    dataKey="value"
                                    outerRadius={80}
                                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                >
                                    <Cell fill="#22c55e" /> {/* Low - Green */}
                                    <Cell fill="#eab308" /> {/* Medium - Yellow */}
                                    <Cell fill="#ef4444" /> {/* High - Red */}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: 'var(--chart-text)' }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Donut Timing */}
                    <ChartCard title="Completion Timing">
                        {completedTasksCount === 0 ? (
                            <EmptyChartState icon="⏳" message="Complete tasks to see timing analytics" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={completionTimingData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                                    >
                                        {completionTimingData.map((_, i) => (
                                            <Cell key={i} fill={timingColors[i]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            color: 'var(--foreground)'
                                        }}
                                    />
                                    <Legend verticalAlign="bottom" formatter={(value) => <span style={{ color: 'var(--chart-text)' }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>


                    {/* Weekly Analytics */}
                    <ChartCard title="Tasks Completed (Last 7 Days)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyCompletionData}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--muted)' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} barSize={40}>
                                    {/* Gradient fill */}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Monthly Analytics */}
                    <ChartCard title="Monthly Completion Trend">
                        {monthlyCompletionData.length === 0 ? (
                            <EmptyChartState icon="📆" message="No tasks completed this month" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyCompletionData}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'var(--muted)' }}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            color: 'var(--foreground)'
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>


                    {/* SUMMARY */}
                    <div className="lg:col-span-2">
                        <ChartCard title="Productivity Summary">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <SummaryRow label="Tasks Completed" value={completedTasksCount} color="green" />
                                    <SummaryRow
                                        label="On-time Completion"
                                        value={`${onTimeCompletionPercent}%`}
                                        color="blue"
                                        subtext={`${completedOnTimeCount} tasks`}
                                    />
                                    <SummaryRow
                                        label="Before-Time Completion"
                                        value={`${beforeTimeCompletionPercent}%`}
                                        color="blue"
                                        subtext={`${completedEarlyCount} tasks`}
                                    />
                                    <SummaryRow
                                        label="Late Completion"
                                        value={`${lateCompletionPercent}%`}
                                        color="red"
                                        subtext={`${completedLateCount} tasks`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <SummaryRow label="Total Pending" value={totalTasks - completedTasksCount} color="orange" />
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mt-4 border border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">Longest Streak</span>
                                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                {longestOnTimeStreak} {longestOnTimeStreak === 1 ? "day" : "days"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-yellow-500 h-full rounded-full"
                                                style={{ width: `${Math.min((longestOnTimeStreak / 30) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Target: 30 days to become a habit master!</p>
                                    </div>
                                </div>
                            </div>
                        </ChartCard>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}

/* ===== COMPONENTS ===== */

function ChartCard({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                {title}
            </h3>
            {children}
        </div>
    );
}

function EmptyChartState({ icon, message }) {
    return (
        <div className="h-[300px] flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 opacity-70">
            <div className="text-4xl mb-3 grayscale">{icon}</div>
            <p className="font-semibold">{message}</p>
        </div>
    );
}

function SummaryRow({ label, value, color, subtext }) {
    const map = {
        green: "text-green-600 dark:text-green-400",
        blue: "text-blue-600 dark:text-blue-400",
        red: "text-red-600 dark:text-red-400",
        orange: "text-orange-600 dark:text-orange-400",
    };
    return (
        <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
            <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
            <div className="text-right">
                <div className={`font-bold text-lg ${map[color]}`}>{value}</div>
                {subtext && <div className="text-xs text-gray-400 font-medium">{subtext}</div>}
            </div>
        </div>
    );
}

function StatCard({ title, value, color, gradient, textColor, icon, suffix }) {
    if (gradient) {
        return (
            <div className={`rounded-2xl p-6 ${textColor || 'text-white'} shadow-lg bg-gradient-to-br ${gradient} transform transition hover:scale-105 duration-300 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-50 transform group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{title}</h3>
                <p className="text-3xl font-black">{value}</p>
                {suffix && <p className="text-xs opacity-70 mt-1">{suffix}</p>}
            </div>
        );
    }

    const colorMap = {
        blue: "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900",
        indigo: "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900",
        purple: "bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900",
        red: "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900",
        green: "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900",
    };

    return (
        <div className={`rounded-2xl p-6 border ${colorMap[color]} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative`}>
            <div className="absolute top-4 right-4 opacity-50">{icon}</div>
            <h3 className="text-xs font-bold uppercase opacity-80 mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
            {suffix && <p className="text-xs opacity-60 mt-1 font-medium">{suffix}</p>}
        </div>
    );
}

export default StatsPage;
