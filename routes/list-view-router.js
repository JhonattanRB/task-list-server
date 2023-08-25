const express = require("express");

module.exports = (tasks) => {
  const router = express.Router();

  // Listar todas la tareas
  router.get("/", (req, res) => {
    res.json(tasks);
  });

  // Hacer una solicitud GET para listar las tareas que están completas.
  router.get("/completed", (req, res) => {
    const completedTasks = tasks.filter((task) => task.isCompleted);
    res.json(completedTasks);
  });

  // Hacer una solicitud GET para listar las tareas que están incompletas.
  router.get("/incomplete", (req, res) => {
    const incompleteTasks = tasks.filter((task) => !task.isCompleted);
    res.json(incompleteTasks);
  });

  return router;
};
