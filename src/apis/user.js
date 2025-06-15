import { axiosInstance } from "./axios";

export const getUserInfo = async () => {
  const { data } = await axiosInstance.get("/users/me");

  return data;
};

export const updateUserInfo = async (userData) => {
  const { data } = await axiosInstance.put("/users/me", userData);

  return data;
};

export const deleteUser = async () => {
  const { data } = await axiosInstance.delete("/users/me");

  return data;
};
