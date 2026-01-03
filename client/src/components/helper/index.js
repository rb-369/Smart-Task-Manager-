

export default function getDueStatus(dueDate, status) {
  if (!dueDate || status === "done") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { type: "overdue" };
  if (diffDays === 0) return { type: "today" };
  if (diffDays === 1) return { type: "tomorrow" };

  return { type: "future", days: diffDays };
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// normalize date to midnight (date-only comparison)
function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function getCompletionTiming(dueDate, completedAt) {
    // no deadline → always on time
    if (!dueDate) return "onTime";

    const due = normalizeDate(dueDate);
    const completed = normalizeDate(completedAt);

    if (completed < due) return "early";
    if (completed.getTime() === due.getTime()) return "onTime";
    return "late";
}


