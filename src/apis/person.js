import { axiosInstance } from "./axios";

export const getPersonInfo = async (personId) => {
  const { data } = await axiosInstance.get(`/persons/${personId}/info/all`);

  return data;
};
