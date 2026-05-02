import { useEffect, useState } from "react";
import { useParams }           from "react-router-dom";
import toast                   from "react-hot-toast";
import projectService          from "../services/projectService";
import { useAuth }             from "../hooks/useAuth";
import { useTasks }            from "../hooks/useTasks";
import Card                    from "../components/ui/Card";
import Button                  from "../components/ui/Button";
import Modal                   from "../components/ui/Modal";
import TaskForm                from "../components/tasks/TaskForm";
import TaskTable               from "../components/tasks/TaskTable";
import { getInitials }         from "../utils/helpers";

export default function ProjectDetail() {
  const { id }   = useParams();
  const { user } = useAuth();

  const [project,     setProject]     = useState(null);
  const [loadingProj, setLoadingProj] = useState(true);
  const [taskModal,   setTaskModal]   = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole,  setMemberRole]  = useState("member");
  const [saving,      setSaving]      = useState(false);

  const {
    tasks, loading: loadingTasks,
    createTask, updateTask, updateStatus, deleteTask,
  } = useTasks(id);

  // ── Determine role ──
  const isAdmin = (() => {
    if (!project || !user) return false;
    const creatorId = project.createdBy?._id || project.createdBy;
    if (String(creatorId) === String(user._id)) return true;
    const m = project.members?.find(
      (m) => String(m.user?._id || m.user) === String(user._id)
    );
    return m?.role === "admin";
  })();

  const fetchProject = async () => {
    try {
      const res = await projectService.getById(id);
      setProject(res.data.data.project);
    } catch (err) {
      console.error("fetchProject error:", err.response?.data);
      toast.error("Failed to load project");
    } finally {
      setLoadingProj(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  // ── Task handlers ──
  const openCreate = () => { setEditingTask(null); setTaskModal(true); };
  const openEdit   = (task) => { setEditingTask(task); setTaskModal(true); };
  const closeTask  = () => { setTaskModal(false); setEditingTask(null); };

  const handleSaveTask = async (formData) => {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success("Task updated!");
      } else {
        await createTask(formData);
        toast.success("Task created!");
      }
      closeTask();
    } catch (err) {
      console.error("saveTask error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus(taskId, status);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // ── Member handlers ──
  const handleAddMember = async () => {
    if (!memberEmail.trim()) return toast.error("Email is required");
    setSaving(true);
    try {
      await projectService.addMember(id, {
        email: memberEmail.trim(),
        role:  memberRole,
      });
      toast.success("Member added!");
      setMemberModal(false);
      setMemberEmail("");
      setMemberRole("member");
      fetchProject();
    } catch (err) {
      console.error("addMember error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await projectService.removeMember(id, userId);
      toast.success("Member removed");
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  if (loadingProj) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              {project.name}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
              ${isAdmin
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"}`}>
              {isAdmin ? "👑 Admin" : "👤 Member"}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {project.description || "No description"}
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm"
                    onClick={() => setMemberModal(true)}>
              + Add Member
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              + New Task
            </Button>
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total",
            value: tasks.length,
            bg: "bg-blue-50 text-blue-700" },
          { label: "Todo",
            value: tasks.filter((t) => t.status === "todo").length,
            bg: "bg-gray-50 text-gray-700" },
          { label: "In Progress",
            value: tasks.filter((t) => t.status === "in-progress").length,
            bg: "bg-yellow-50 text-yellow-700" },
          { label: "Done",
            value: tasks.filter((t) => t.status === "done").length,
            bg: "bg-green-50 text-green-700" },
        ].map(({ label, value, bg }) => (
          <Card key={label} className={`text-center py-3 ${bg}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Tasks — 3 cols */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Tasks ({tasks.length})
            </h2>
            {!isAdmin && (
              <span className="text-xs text-gray-400 bg-gray-100
                               px-2 py-1 rounded-full">
                You can update status of your assigned tasks
              </span>
            )}
          </div>

          {loadingTasks ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-primary-500
                              border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TaskTable
              tasks={tasks}
              isAdmin={isAdmin}
              currentUserId={user?._id}
              onEdit={openEdit}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        {/* Members — 1 col */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">
            Team ({project.members?.length || 0})
          </h2>
          <Card className="p-4 space-y-3">
            {project.members?.map(({ user: m, role }) => {
              const creatorId = project.createdBy?._id || project.createdBy;
              const isCreator = String(m._id) === String(creatorId);
              const isMe      = String(m._id) === String(user?._id);

              return (
                <div key={m._id}
                     className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full
                                    flex items-center justify-center
                                    text-primary-700 text-xs font-bold shrink-0">
                      {getInitials(m.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {m.name}
                        {isMe && (
                          <span className="text-xs text-primary-400 ml-1">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {m.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full
                                      font-medium
                      ${role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"}`}>
                      {role}
                    </span>
                    {isAdmin && !isCreator && !isMe && (
                      <button
                        onClick={() => handleRemoveMember(m._id)}
                        className="p-0.5 text-gray-300 hover:text-red-500
                                   transition"
                        title="Remove member"
                      >
                        <svg className="w-3.5 h-3.5" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {project.members?.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No members yet
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* ── Task Modal ── */}
      <Modal
        isOpen={taskModal}
        onClose={closeTask}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          initialData={editingTask}
          members={project.members || []}
          onSubmit={handleSaveTask}
          onCancel={closeTask}
          loading={saving}
        />
      </Modal>

      {/* ── Add Member Modal ── */}
      <Modal
        isOpen={memberModal}
        onClose={() => {
          setMemberModal(false);
          setMemberEmail("");
          setMemberRole("member");
        }}
        title="Add Team Member"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              placeholder="member@example.com"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-300
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              User must have an account in this app
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300
                         rounded-lg text-sm bg-white focus:outline-none
                         focus:ring-2 focus:ring-primary-500"
            >
              <option value="member">👤 Member — can update own tasks</option>
              <option value="admin">👑 Admin — full access</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline" fullWidth
              onClick={() => {
                setMemberModal(false);
                setMemberEmail("");
                setMemberRole("member");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary" fullWidth
              onClick={handleAddMember}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}