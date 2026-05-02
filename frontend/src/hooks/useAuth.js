import { useAuth as useAuthContext } from "../context/AuthContext";

// Re-export with extra helpers
export const useAuth = () => {
  const auth = useAuthContext();

  const isAdmin = (project) => {
    if (!project || !auth.user) return false;
    const isCreator = project.createdBy?._id === auth.user._id ||
                      project.createdBy === auth.user._id;
    const member = project.members?.find(
      (m) => (m.user?._id || m.user) === auth.user._id
    );
    return isCreator || member?.role === "admin";
  };

  const isMember = (project) => {
    if (!project || !auth.user) return false;
    return project.members?.some(
      (m) => (m.user?._id || m.user) === auth.user._id
    );
  };

  const isTaskAssignee = (task) => {
    if (!task || !auth.user) return false;
    return (task.assignedTo?._id || task.assignedTo) === auth.user._id;
  };

  return { ...auth, isAdmin, isMember, isTaskAssignee };
};

export default useAuth;