import { Project, Task, TaskFormData, taskSchema } from "@/types/index";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
};
export const createTask = async ({
  projectId,
  formData,
}: Pick<TaskAPI, "formData" | "projectId">) => {
  try {
    const url = `projects/${projectId}/tasks`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
  }
};

export const getTaskById = async ({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) => {
  try {
    const url = `projects/${projectId}/tasks/${taskId}`;
    const { data } = await api(url);
    const response = taskSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
  }
};
export const updateTask = async ({
  formData,
  taskId,
  projectId,
}: Pick<TaskAPI, "formData" | "taskId" | "projectId">) => {
  try {
    const url = `projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
  }
};
export const deleteTask = async ({
  taskId,
  projectId,
}: Pick<TaskAPI, "taskId" | "projectId">) => {
  try {
    const url = `projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
  }
};
