import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const response = await axios.get(
  `${API_URL}/api/users`
);
export const loginUser = async (
  email,
  password
) => {
  const response =
    await axios.post(
      `${API}/login`,
      {
        email,
        password,
      }
    );

  return response.data;
};

export const registerUser =
async (
  name,
  email,
  password
) => {
  const response =
    await axios.post(
      `${API}/register`,
      {
        name,
        email,
        password,
      }
    );

  return response.data;
};