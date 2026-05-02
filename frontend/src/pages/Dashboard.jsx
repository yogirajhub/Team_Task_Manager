import { useEffect, useState } from "react";
import { Link }                from "react-router-dom";
import toast                   from "react-hot-toast";
import api                     from "../services/api";
import { useAuth }             from "../hooks/useAuth";
import Card                    from "../components/ui/Card";
import { StatusBadge }         from "../components/ui/Badge";
import { formatDate }          from "../utils/helpers";

const StatCard = ({ label, value, color, icon }) => (
  <Card className={`flex items-center gap-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
    </div>
  </Card>
);

export default function Dashboard() {
  const { user }              = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err.response?.data);
        toast.error("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, overdueTasks = [], myTasks = [], totalProjects = 0 } = data || {};

  return (
    <div className="space-y-6">

      {/* Header with user role */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.name} 👋
          </p>
        </div>

        {/* Profile + role card */}
        <Card className="flex items-center gap-3 py-3 px-4">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center
                          justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="ml-2 pl-3 border-l border-gray-200">
            <p className="text-xs text-gray-400">Account Type</p>
            <span className="text-xs font-bold text-primary-600">
              Registered User
            </span>
          </div>
        </Card>
      </div>

      {/* ── How to know if you're admin ── */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-blue-800 text-sm">
              How roles work in this app
            </p>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
              You are <strong>Admin</strong> in projects you <strong>created</strong>
              , or projects where an admin gave you the Admin role.
              You are a <strong>Member</strong> in projects you were invited to.
              Open any project — your role badge (👑 Admin / 👤 Member)
              shows in the top right.
            </p>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={totalProjects}
                  color="bg-indigo-50"  icon="📁" />
        <StatCard label="Total Tasks"    value={stats?.total}
                  color="bg-blue-50"    icon="📋" />
        <StatCard label="Completed"      value={stats?.completed}
                  color="bg-green-50"   icon="✅" />
        <StatCard label="Overdue"        value={stats?.overdue}
                  color="bg-red-50"     icon="🔴" />
      </div>

      {/* Progress bar */}
      {stats?.total > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Overall Progress
            </p>
            <p className="text-sm text-gray-500">
              {stats.completed}/{stats.total} tasks completed
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((stats.completed / stats.total) * 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {Math.round((stats.completed / stats.total) * 100)}% done
          </p>
        </Card>
      )}

      {/* Status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Todo",        value: stats?.pending,    color: "border-l-gray-400",   bg: "bg-gray-50"   },
          { label: "In Progress", value: stats?.inProgress, color: "border-l-yellow-400", bg: "bg-yellow-50" },
          { label: "Done",        value: stats?.completed,  color: "border-l-green-400",  bg: "bg-green-50"  },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={`border-l-4 ${color} ${bg}`}>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? 0}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Overdue Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">⚠️ Overdue Tasks</h2>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1
                             rounded-full font-medium">
              {stats?.overdue ?? 0} overdue
            </span>
          </div>
          {overdueTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-gray-400 text-sm">No overdue tasks!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {overdueTasks.map((task) => (
                <li key={task._id}
                    className="flex items-start justify-between p-3
                               bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📁 {task.project?.name} · 📅 {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* My Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">📌 My Tasks</h2>
            <Link to="/projects"
                  className="text-xs text-primary-600 hover:underline font-medium">
              View projects →
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-gray-400 text-sm">No tasks assigned to you</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {myTasks.map((task) => (
                <li key={task._id}
                    className="flex items-start justify-between p-3
                               bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📁 {task.project?.name} · 📅 {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}