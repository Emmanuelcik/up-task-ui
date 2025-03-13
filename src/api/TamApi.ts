import { isAxiosError } from "axios";
import api from "@/lib/axios";
import {
  Project,
  TeamMember,
  TeamMemberForm,
  teamMembersSchema,
} from "./../types/index";

type GetUserType = {
  projectId: Project["_id"];
  formData: TeamMemberForm;
};
export const findUserByEmail = async ({ projectId, formData }: GetUserType) => {
  try {
    const url = `/projects/${projectId}/team/find`;
    const { data } = await api.post(url, formData);
    console.log({ data });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

type AddUserType = {
  projectId: Project["_id"];
  id: TeamMember["_id"];
};
export const addUserToProjectById = async ({ projectId, id }: AddUserType) => {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.post(url, { id });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const getPtojectTeam = async (projectId: Project["_id"]) => {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.get(url);
    const response = teamMembersSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
