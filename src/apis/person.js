import { axiosInstance } from "./axios";

export const getPersonInfo = async (personId) => {
  const { data } = await axiosInstance.get(`/persons/${personId}/info/all`);

  return data;
};

export const postPersonMemory = async (personId, memoryData) => {
  const { data } = await axiosInstance.post(
    `/persons/${personId}/info/memory`,
    memoryData
  );

  return data;
};

export const updatePersonInfo = async (personId, updatedData) => {
  const { data } = await axiosInstance.put(`/persons/${personId}`, updatedData);

  return data;
};

export const postPersonFavorite = async (personId) => {
  const { data } = await axiosInstance.post(`/persons/${personId}/favorites`);

  return data;
};

export const deletePersonFavorite = async (personId) => {
  const { data } = await axiosInstance.delete(`/persons/${personId}/favorites`);

  return data;
};
