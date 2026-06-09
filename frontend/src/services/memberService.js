import axios from "axios";

const API =
  "http://localhost:5000/api";

export const addMember =
async (boardId, userId) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.post(
      `${API}/members/add`,
      {
        boardId,
        userId,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};