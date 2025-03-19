import { Project, User } from "../types";

export const isManager = (managerId: Project["_id"], userId: User["_id"]) =>
  managerId === userId;
