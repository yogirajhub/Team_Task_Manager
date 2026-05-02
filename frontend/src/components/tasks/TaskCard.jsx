import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { formatDate, isOverdue, getInitials } from "../../utils/helpers";

export default function TaskCard({ task, isAdmin, isAssignee, onEdit,
                                   onDelete, onStatusChange }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const canChangeStatus = isAdmin || isAssignee;

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all
      hover:shadow-md ${overdue ? "border-red-200 bg-red-50/20" : "border-gray-100"}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {task.title}
            </h4>
            {overdue && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5
                               rounded-full font-medium shrink-0">
                Overdue
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Admin action buttons */}
        {isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-400 hover:text-primary-600
                         hover:bg-primary-50 rounded-lg transition"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                     m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-400 hover:text-red-600
                         hover:bg-red-50 rounded-lg transition"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995
                     -1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1
                     1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center
                              justify-center text-primary-700 text-xs font-bold">
                {getInitials(task.assignedTo.name)}
              </div>
              <span>{task.assignedTo.name}</span>
            </div>
          )}
          {task.dueDate && (
            <span className={overdue ? "text-red-500 font-medium" : ""}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Status dropdown — admin or assignee */}
        {canChangeStatus && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1
                       bg-white text-gray-700 focus:outline-none
                       focus:ring-1 focus:ring-primary-500 cursor-pointer"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        )}
      </div>
    </div>
  );
}