//Zona de importacion de modulos
import express from "express"; // importacion de express para ejecucion de app
import dotenv from 'dotenv'; // Importacion de dotenv para manejo de varibles de entorno
import { connect, getDB, disconnect} from "./src/config/db.js"; // Importacion de metodos para conexio con DB
import { initModels } from "./src/models/index.js"; // Importacion de inicializador de modelos o clases en la BD

// Inicializacion de config para variables de entorno
dotenv.config();

// Inicalizacion de variables y app 
const port = process.env.PORT || 3000;// Incializamos y traemos puerto
const app = express();// Incializamos app 

//Middleware de interpretacion de JSON
app.use(express.json());

// Abrimos conexion
connect() 
  .then( async() => { // Conexion correcta
    await initModels(getDB()); // Creacion y actualizacion de validadores e indices de las clases 
    const server = app.listen(port, () => { // iniciamos servidor
      console.log(`🚀 http://localhost:${port}/api`); // Mensaje en consola de conexion y puerto
    });
    const shutdown = async (sig) => { // Funcion para apagado ordenado
      console.log(`\n${sig} recibido. Cerrando...`); // mensjae en consola de la causa de ejecusion de cierre 
      server.close(async () => { await disconnect(); process.exit(0); }); // Cierra conexiones y sale de pprocesos sale con codigo 0 de cierre correcto
    };
    process.on("SIGINT", () => shutdown("SIGINT")); // Captura Ctrl+C en la terminal
    process.on("SIGTERM", () => shutdown("SIGTERM")); // Captura la señal de terminación
  })
  .catch((err) => { // cxonexion incorrecta
    console.error("❌ No se pudo conectar a MongoDB:", err); // mensja ede error de  conexion
    process.exit(1); // sale de proceso con codigo 1 de falla 
  });
// Ruta para comprobar DB
app.get("/health", async (req, res) => {
  try {
    const db = getDB();
    await db.command({ ping: 1 });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});