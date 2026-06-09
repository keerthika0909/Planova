import api from "./api";

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data.tasks ?? response.data; // handle both shapes
};
export const getTasksByBoard = async (boardId) => {
  const response = await api.get(`/tasks/board/${boardId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};