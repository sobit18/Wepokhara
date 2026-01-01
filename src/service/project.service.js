import Project from "../models/Project.js";

export const createProject = async (data) => {
  return await Project.create(data);
};

export const getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 });
};

export const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};