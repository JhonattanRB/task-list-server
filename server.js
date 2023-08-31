// server express:

const express = require("express");
const listViewRouter = require("./routes/list-view-router"); // Importa el router
const listEditRouter = require("./routes/list-edit-router");
const PORT = 8000;
const app = express();

let tasks = [
  { id: "123456", isCompleted: false, description: "Walk the dog" },
  {
    id: "789012",
    isCompleted: true,
    description: "Learn Node Js y Express",
  },
  {
    id: "345678",
    isCompleted: false,
    description: "Create a server using Express",
  },
  {
    id: "901234",
    isCompleted: true,
    description: "Implement Express Router in server.js",
  },
];

//Definir metodos válidos
const Allowed_Methods = ["GET", "POST", "PUT", "DELETE"];

// Middleware para comprobar métodos HTTP permitidos
app.use((req, res, next) => {
  if (!Allowed_Methods.includes(req.method)) {
    res.status(405).send("Método no permitido");
  } else {
    next();
  }
});

// Middlewares
app.use(express.json()); // Para poder leer el cuerpo de las solicitudes POST/PUT en formato JSON
app.use("/tasks", listViewRouter(tasks)); // Incorporamos las rutas del router de visualización
app.use("/task", listEditRouter(tasks)); // Incorporamos las rutas del router de edición

// Si ninguna de las rutas anteriores se cumple, se considera una petición no encontrada
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
