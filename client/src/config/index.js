export const signUpFormControls = [
    {
        id: "name",
        label: "Name",
        placeholder: "Enter your Name",
        componentType: "input",
        type: "text",
        validation: {
            required: "Name is required"
        }
    },
    {
        id: "email",
        label: "Email",
        placeholder: "Enter your Email",
        componentType: "input",
        type: "email",
        validation: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
            }
        }
    },
    {
        id: "password",
        label: "Password",
        placeholder: "Enter your Password",
        componentType: "input",
        type: "password",
        validation: {
            required: "Password is required",
            minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
            }
        }
    }
]


export const signInFormControls = [
    {
        id: "email",
        label: "Email",
        placeholder: "Enter your Email",
        componentType: "input",
        type: "email",
        validation: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
            }
        }
    },
    {
        id: "password",
        label: "Password",
        placeholder: "Enter your Password",
        componentType: "input",
        type: "password",
        validation: {
            required: "Password is required",
            minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
            }
        }
    }
]

export const scrumBoardOptions = [
    {
        id: "todo",
        label: "To DO"
    },
    {
        id: "inProgress",
        label: "In Progress"
    },
    {
        id: "blocked",
        label: "Blocked"
    },
    {
        id: "review",
        label: "Review"
    },
    {
        id: "done",
        label: "Done"
    },
]

export const addNewTaskFormControls = [
    {
        id: "title",
        type: "text",
        placeholder: "Enter Title",
        label: "Title",
        componentType: "input",
        validation: {
            required: "Title is required"
        }
    },
    {
        id: "description",
        type: "text",
        placeholder: "Enter description",
        label: "Description",
        componentType: "input",
        // validation: {
        //     required: "Description is required"
        // }
    },
    {
        id: "status",
        placeholder: "Select Status",
        label: "Status",
        componentType: "select",
        options: scrumBoardOptions,
        validation: {
            required: "Status is required"
        }
    },
    {
        id: "priority",
        placeholder: "Select Priority",
        label: "Priority",
        componentType: "select",
        options: [
            {
                id: "low",
                label: "Low",
                color: "border-l-green-500 bg-green-50",
            },
            {
                id: "medium",
                label: "Medium",
                color: "border-l-yellow-500 bg-yellow-50"
            },
            {
                id: "high",
                label: "High",
                color: "border-l-red-500 bg-red-50"
            }
        ],
        validation: {
            required: "Priority is required"
        }
    },
    {
        id: "dueDate",
        label: "Deadline (optional)",
        componentType: "input",
        type: "date",
        validation: {
            validate: (value, formValues) => {
                if (!value) return true;

                const selectedDate = new Date(value);
                selectedDate.setHours(0, 0, 0, 0);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // ✅ ALLOW if editing an existing task
                if (formValues?.id) return true;

                // ❌ Only block for new tasks
                return selectedDate >= today || "Deadline cannot be in the past";
            }
        }
    }

]

export const PRIORITY_COLOR_MAP = {
    // Light mode: Pastel background
    // Dark mode: Distinct thick left border (ratio ~10-15%) with neutral dark background
    low: "border-black bg-green-500 hover:bg-green-400 dark:bg-gray-800 dark:border-l-[24px] dark:border-green-600 dark:border-y-0 dark:border-r-0 dark:text-gray-100",
    medium: "border-black bg-yellow-300 hover:bg-yellow-200 dark:bg-gray-800 dark:border-l-[24px] dark:border-yellow-600 dark:border-y-0 dark:border-r-0 dark:text-gray-100",
    high: "border-black bg-red-400 hover:bg-red-300 dark:bg-gray-800 dark:border-l-[24px] dark:border-red-600 dark:border-y-0 dark:border-r-0 dark:text-gray-100",
};

export const priority_colors = {
    low: "bg-green-500 hover:bg-green-400 dark:bg-green-600",
    medium: "bg-yellow-300 hover:bg-yellow-200 dark:bg-amber-600",
    high: "bg-red-400 hover:bg-red-300 dark:bg-red-600"
}

// export const hoverColorLogic = {
//     low: "hover: bg-green-100",
//     medium: "hover: bg-yellow-100",
//     high: "hover: bg-red-200"
// }
