import api from "@/lib/axios";
import { dashboardProjectSchema, Project, ProjectFormData } from "../types";
import { isAxiosError } from "axios";

export const createProject = async (formData: ProjectFormData) => {
  try {
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
export const getProjects = async () => {
  try {
    const { data } = await api("/projects");
    const response = dashboardProjectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
export const getProjectById = async (id: Project["_id"]) => {
  try {
    const { data } = await api(`/projects/${id}`);
    // const response = dashboardProjectSchema.safeParse(data);
    // if (response.success) {
    //   return response.data;
    // }
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};
export const updateProject = async ({
  formData,
  projectId,
}: ProjectAPIType) => {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
