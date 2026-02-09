import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useContext } from "react";
import { TaskManagerContext } from "@/context";

function SearchFilterBar({
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    filterPriority, setFilterPriority
}) {

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">

            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search tasks..."
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Controls Group */}
            <div className="flex gap-2">

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <ArrowUpDown className="h-4 w-4" />
                            <span>Sort by</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default (Newest)</SelectItem>
                        <SelectItem value="priority-high">Priority (High-Low)</SelectItem>
                        <SelectItem value="priority-low">Priority (Low-High)</SelectItem>
                        <SelectItem value="due-date">Due Date (Earliest)</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                </Select>

                {/* Filter Priority */}
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[160px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Filter className="h-4 w-4" />
                            <span>Priority</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default SearchFilterBar;
