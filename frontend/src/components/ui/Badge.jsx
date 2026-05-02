import { statusColors, priorityColors } from "../../utils/helpers";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                      text-xs font-medium capitalize ${statusColors[status]}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                      text-xs font-medium capitalize ${priorityColors[priority]}`}>
      {priority}
    </span>
  );
}