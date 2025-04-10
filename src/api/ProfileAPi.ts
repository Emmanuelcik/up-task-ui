import { isAxiosError } from "axios";
import { UpdateCurrentPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

export const updateProfile = async (formData: UserProfileForm) => {
  try {
    const url = `/auth/profile`;
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
export const changePassword = async (formData: UpdateCurrentPasswordForm) => {
  try {
    const url = `/auth/password-update`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
