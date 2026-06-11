import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const response = await axios.get(
  `${API_URL}/api/users`
);

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