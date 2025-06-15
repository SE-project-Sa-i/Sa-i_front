import { axiosInstance } from "./axios";

export const postSignUp = async (body) => {
  const { data } = await axiosInstance.post("/auth/signup", body);

  return data;
};

export const postSignIn = async (body) => {
  const { data } = await axiosInstance.post("/auth/login", body);

  return data;
};
