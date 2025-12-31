import { createProject, getAllProjects, deleteProject } from "../services/project.service.js";

export const createProjectController = async (req, res) => {
  try {
    const { title, shortDescription, category, detailedDescription, targetVotes, userId } = req.body;
    const image = req.file ? req.file.path : null;

    const project = await createProject({
      title,
      shortDescription,
      category,
      detailedDescription,
      targetVotes,
      image,
      userId,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


