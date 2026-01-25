import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await axiosInstance.put("/auth/profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
