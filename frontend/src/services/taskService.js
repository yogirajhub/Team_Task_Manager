import api from "./api";

const taskService = {
  getByProject:  (projectId, params) =>
    api.get(`/projects/${projectId}/tasks`, { params }),
  create:        (projectId, data)   =>
    api.post(`/projects/${projectId}/tasks`, data),
  update:        (taskId, data)      => api.put(`/tasks/${taskId}`, data),
  updateStatus:  (taskId, status)    =>
    api.patch(`/tasks/${taskId}/status`, { status }),
  delete:        (taskId)            => api.delete(`/tasks/${taskId}`),
};

export default taskService;