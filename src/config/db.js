//Zona de importacion de modulos
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

// Inicializacion de config para variables de entorno
dotenv.config();

// Inicializamos Variables de entorno
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "recetario_de_la_abuela";

// Validacion de seguridad de URI
if (!uri) {
  throw new Error("Falta MONGODB_URI en .env");
}

// Inicializamos cliente con monfodb
const client = new MongoClient(uri);
let db = null; // Incializamo variable para contener la BD

// Zona de Funciones

// Funcion asyncrona para conexion con DB
export async function connect() {
    try { 
        await client.connect(); // Esperamos que conecte con el cliente
        console.log(`Conexion con BD: ${dbName} de Mongo Exitosa`); // Mensaje en consola de corecta conexion con DB
        db = client.db(dbName); // Guardamos BD obtenida
        await db.command({ ping: 1 }); // Pingo de conexion inmediata para verificar 
    } catch (error) {
        console.log("Error al conectar con la BD de Mongo", error);
    }
}
// Funcion para obtener la DB
export function getDB(){
    if(!db){ // Si no se logra obtener DB
        throw new Error("No se logro obtener DB");
    }
    return db; // Retornamos datos de la DB obtenida
}
// Funcion para Desconectar correctamente de la DB
export async function disconnect() {
  if (db) {
    await client.close();
    db = null;
    if (process.env.NODE_ENV !== "test") {
      console.log("👋 Conexión a MongoDB cerrada.");
    }
  }
}