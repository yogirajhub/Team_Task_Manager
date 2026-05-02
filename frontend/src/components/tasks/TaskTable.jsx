import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { formatDate, isOverdue, getInitials } from "../../utils/helpers";

export default function TaskTable({ tasks, isAdmin, currentUserId,
                                    onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-gray-500 font-medium">No tasks found</p>
        {isAdmin && (
          <p className="text-gray-400 text-sm mt-1">
            Create a task to get started
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Task", "Assignee", "Priority", "Status", "Due Date",
                "Actions"].map((h) => (
                <th key={h}
                    className="px-4 py-3 text-left text-xs font-semibold
                               text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.map((task) => {
              const overdue     = isOverdue(task.dueDate, task.status);
              const isAssignee  = (task.assignedTo?._id || task.assignedTo)
                                   === currentUserId;
              const canAct      = isAdmin || isAssignee;

              return (
                <tr key={task._id}
                    className={`hover:bg-gray-50 transition-colors
                      ${overdue ? "bg-red-50/30" : ""}`}>

                  {/* Task title */}
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-400 truncate max-w-48">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {overdue && (
                        <span className="text-xs bg-red-100 text-red-600
                                         px-1.5 py-0.5 rounded-full shrink-0">
                          Late
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full
                                        flex items-center justify-center
                                        text-primary-700 text-xs font-bold shrink-0">
                          {getInitials(task.assignedTo.name)}
                        </div>
                        <span className="text-gray-700 text-xs truncate max-w-24">
                          {task.assignedTo.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Unassigned</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {canAct ? (
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg
                                   px-2 py-1 bg-white text-gray-700
                                   focus:outline-none focus:ring-1
                                   focus:ring-primary-500 cursor-pointer"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    ) : (
                      <StatusBadge status={task.status} />
                    )}
                  </td>

                  {/* Due date */}
                  <td className={`px-4 py-3 text-xs
                    ${overdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
                    {formatDate(task.dueDate)}
                  </td>

                  {/* Actions — Admin only */}
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(task)}
                          className="p-1.5 text-gray-400 hover:text-primary-600
                                     hover:bg-primary-50 rounded-lg transition"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none"
                               stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2
                                 0 002-2v-5m-1.414-9.414a2 2 0 112.828
                                 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(task._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600
                                     hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none"
                               stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                                 a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1
                                 -10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}