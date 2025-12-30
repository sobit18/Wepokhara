import Project from "../models/Project.js";

export const createProject = async (data) => {
  return await Project.create(data);
};

