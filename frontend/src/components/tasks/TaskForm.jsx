import { useState, useEffect } from "react";
import Button from "../ui/Button";

const empty = {
  title: "", description: "", assignedTo: "",
  priority: "medium", status: "todo", dueDate: "",
};

export default function TaskForm({ onSubmit, onCancel, members = [],
                                   initialData = null, loading = false }) {
  const [form, setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       || "",
        description: initialData.description || "",
        assignedTo:  initialData.assignedTo?._id || initialData.assignedTo || "",
        priority:    initialData.priority    || "medium",
        status:      initialData.status      || "todo",
        dueDate:     initialData.dueDate
                       ? initialData.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(empty);
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.title.trim().length < 2) e.title = "Title must be at least 2 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => field("title", e.target.value)}
          placeholder="Task title"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${errors.title ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => field("description", e.target.value)}
          rows={2}
          placeholder="Optional description..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                     text-sm focus:outline-none focus:ring-2
                     focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Assign To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          value={form.assignedTo}
          onChange={(e) => field("assignedTo", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                     text-sm bg-white focus:outline-none
                     focus:ring-2 focus:ring-primary-500"
        >
          <option value="">— Unassigned —</option>
          {members.map(({ user: m }) => (
            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
          ))}
        </select>
      </div>

      {/* Priority + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(e) => field("priority", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                       text-sm bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => field("status", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                       text-sm bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => field("dueDate", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                     text-sm focus:outline-none focus:ring-2
                     focus:ring-primary-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading
            ? "Saving..."
            : initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}