const express = require("express");

module.exports = (tasks) => {
  const router = express.Router();

  // Middleware de validación para POST y PUT
  router.use(["/", "/:id"], (req, res, next) => {
    const { id, isCompleted, description } = req.body;

    // Verificar que el cuerpo no esté vacío para POST y PUT
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("El cuerpo de la solicitud está vacío");
    }

    // Validación específica para POST
    if (req.method === "POST") {
      if (!id || description === undefined || isCompleted === undefined) {
        return res.status(400).send("Datos incompletos para crear la tarea");
      }
    }

    // Validación específica para PUT
    if (req.method === "PUT") {
      if (description === undefined || isCompleted === undefined) {
        return res
          .status(400)
          .send("Datos incompletos para actualizar la tarea");
      }
    }

    next(); // Si todo es correcto, pasa al siguiente middleware o controlador
  });

  // Hacer una solicitud POST para crear una tarea.
  router.post("/", (req, res) => {
    const { id, isCompleted, description } = req.body; // campos de la task

    /*if (!id || description === undefined || isCompleted === undefined) {
      return res.status(400).send("Datos incompletos");
    }*/

    tasks.push({ id, isCompleted, description });
    res.status(201).send("Tarea creada exitosamente");
  });

  // Hacer una solicitud DELETE para eliminar una tarea.
  router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).send("Tarea no encontrada");
    }

    tasks.splice(taskIndex, 1); // Esto elimina el elemento directamente en la lista original

    res.send("Tarea eliminada exitosamente");
  });

  // Hacer una solicitud PUT para actualizar una tarea.
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { isCompleted, description } = req.body;

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).send("Tarea no encontrada");
    }

    if (description !== undefined) {
      tasks[taskIndex].description = description;
    } /*else {
      return res.send("Agrega una descripción a la actualización");
    }*/

    if (isCompleted !== undefined) {
      tasks[taskIndex].isCompleted = isCompleted;
    } /*else {
      return res.send("Agrega un estado a la actualización");
    }*/

    res.send("Tarea actualizada exitosamente");
  });

  return router;
};
