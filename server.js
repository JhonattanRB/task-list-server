// server express:

const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const listViewRouter = require("./routes/list-view-router"); // Importa el router
const listEditRouter = require("./routes/list-edit-router");
const PORT = 8000;
const app = express();

//Tareas predefinidas
let tasks = [
  { id: "123456", isCompleted: false, description: "Walk the dog" },
  {
    id: "789012",
    isCompleted: true,
    description: "Learn Node Js y Express ",
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

//Usuarios predefinidos
const users = [
  { email: "admin@JRtodolist.com", name: "admin", rol: "admin" },
  { email: "user@JRtodolist.com", name: "user", rol: "user" },
];

//Config file Secret Key
dotenv.config({ path: "./.env" });

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

//Inicio
app.get("/", function (req, res) {
  res.send("Welcome to Tasks List server");
});

// Middlewares
app.use(express.json()); // Para poder leer el cuerpo de las solicitudes POST/PUT en formato JSON
app.use("/tasks-list", listViewRouter(tasks)); // Incorporamos las rutas del router de visualización
app.use("/task", listEditRouter(tasks)); // Incorporamos las rutas del router de edición

//ruta de autenticación
app.post("/login", (req, res) => {
  const { email } = req.body;

  // Buscar el usuario en el arreglo 'users'
  const user = users.find((usr) => usr.email === email);

  // Si no se encuentra el usuario, enviar una respuesta con código 401 (No Autorizado)
  if (!user) {
    return res.status(401).send({ error: "Invalid user name or password" });
  }

  // Si el usuario existe, firmar el token usando jsonwebtoken
  const token = jwt.sign(
    { email: user.email, name: user.name, rol: user.rol },
    process.env.SECRET_KEY,
    {
      algorithm: "HS256",
    }
  );

  // Prueba
  console.log("Generated Token:", token);

  // Enviar el token firmado como respuesta
  return res.json({ token });
});

// Middleware JWT
function JWTValidation(req, res, next) {
  // Extraer el token del header "Authorization"
  const authHeader = req.headers.authorization;
  //console.error(req.headers["authorization"]);

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  // Verificar el token
  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.json({ error });
    }

    // Verificar el rol y añadirlo a los headers
    if (decoded.rol === "admin") {
      req.headers = { ...req.headers, rol: "admin" };
      next();
    } else if (decoded.rol === "user") {
      req.headers = { ...req.headers, rol: "user" };
      next();
    } else {
      return res.status(401).json({ error: "Invalid user role" });
    }
  });
}

app.get("/admin", JWTValidation, (req, res) => {
  if (req.headers.rol === "admin") {
    res.send("admin authorization");
  } else {
    res.status(403).json({ error: "Access not allowed" }); // 403 Forbidden indica que el servidor entendió la solicitud, pero se niega a autorizarla.
  }
});

app.get("/clients", JWTValidation, (req, res) => {
  if (req.headers.rol === "admin" || req.headers.rol === "user") {
    res.send("client authorization");
  } else {
    res.status(403).json({ error: "Access not allowed" }); //
  }
});

// Si ninguna de las rutas anteriores se cumple, se considera una petición no encontrada
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
