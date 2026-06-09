import api from "./api";

export const getBoards = async () => {
  const response = await api.get("/boards");
  return response.data.boards ?? response.data;
};
export const createBoard = async (title, createdBy) => {
  const response = await api.post("/boards", { title, createdBy });
  return response.data;
};

export const deleteBoard = async (id) => {
  const response = await api.delete(`/boards/${id}`);
  return response.data;
};