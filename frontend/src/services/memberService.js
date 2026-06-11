import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const addMember = async (boardId, userId) => {
  const response = await api.post("/members/add", { boardId, userId });
  return response.data;
};