import api from "./api";

const projectService = {
  getAll:       ()           => api.get("/projects"),
  getById:      (id)         => api.get(`/projects/${id}`),
  create:       (data)       => api.post("/projects", data),
  delete:       (id)         => api.delete(`/projects/${id}`),
  addMember:    (id, data)   => api.post(`/projects/${id}/members`, data),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

export default projectService;