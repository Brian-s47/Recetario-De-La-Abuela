// Importacion de modulos de inicializacion de clases 
import { initUsuarios } from "./Usuario.js";
import { initIngredientes } from "./Ingrediente.js";
import { initRecetas } from "./Receta.js";

// Funcion para inicializar modelos y validar los datos ya existentes
export async function initModels(db) {
  await initUsuarios(db);
  await initIngredientes(db);
  await initRecetas(db);
}