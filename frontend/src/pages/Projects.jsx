import { useEffect, useState } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import projectService          from "../services/projectService";
import { useAuth }             from "../hooks/useAuth";
import Card                    from "../components/ui/Card";
import Modal                   from "../components/ui/Modal";
import Button                  from "../components/ui/Button";

export default function Projects() {
  const { user }                  = useAuth();
  const navigate                  = useNavigate();
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name: "", description: "" });
  const [saving,    setSaving]    = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data.data.projects);
    } catch (err) {
      console.error("Projects fetch error:", err.response?.data);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const getMyRole = (project) => {
    if (!user) return "member";
    const creatorId = project.createdBy?._id || project.createdBy;
    if (creatorId === user._id) return "admin";
    const m = project.members?.find(
      (m) => (m.user?._id || m.user) === user._id
    );
    return m?.role || "member";
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error("Project name is required");
    setSaving(true);
    try {
      await projectService.create(form);
      toast.success("Project created!");
      setShowModal(false);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await projectService.delete(id);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleOpen = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          + New Project
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500
                          border-t-transparent rounded-full animate-spin" />
        </div>

      /* Empty state */
      ) : projects.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-gray-500 font-medium">No projects yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first project to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white
                       rounded-lg text-sm hover:bg-primary-700 transition"
          >
            Create Project
          </button>
        </Card>

      /* Project grid */
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => {
            const role    = getMyRole(project);
            const isAdmin = role === "admin";

            return (
              <Card key={project._id}
                    className="group hover:shadow-md hover:border-primary-200
                               transition-all duration-200">
                {/* Card top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg
                                    flex items-center justify-center
                                    text-primary-700 font-bold text-sm shrink-0">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Role badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full
                                      font-semibold shrink-0
                      ${isAdmin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-500"}`}>
                      {isAdmin ? "👑 Admin" : "👤 Member"}
                    </span>
                  </div>

                  {/* Delete — admin only */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(project._id, e)}
                      className="text-gray-300 hover:text-red-500 transition
                                 opacity-0 group-hover:opacity-100 p-1"
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none"
                           stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                             a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                             a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Project info */}
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3
                              min-h-[40px]">
                  {project.description || "No description"}
                </p>

                <div className="flex items-center justify-between text-xs
                                text-gray-400 mb-4">
                  <span>
                    👥 {project.members?.length} member
                    {project.members?.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>

                {/* Open button — dedicated, always works */}
                <button
                  onClick={() => handleOpen(project._id)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700
                             text-white text-sm font-medium rounded-lg
                             transition-colors duration-150"
                >
                  Open Project →
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
             title="Create New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full px-4 py-2.5 border border-gray-300
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Marketing Campaign"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Optional description..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth
                    onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth
                    onClick={handleCreate} disabled={saving}>
              {saving ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}