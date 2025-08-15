// Zona de importacion de modulos
import { upsertCollection } from "./utils.js";

export const RECETAS = "recetas";

const tiposEnum = ["Vegetal", "Proteina", "Condimento", "Otro"];

const ingredientSubdoc = {
  bsonType: "object",
  required: ["ingredienteId", "nombre"],
  additionalProperties: false,
  properties: {
    _id: {}, 
    ingredienteId: { bsonType: "objectId", description: "Ref a catálogo" },
    nombre: { bsonType: "string", minLength: 1, description: "Snapshot normalizado" },
    tipo: { enum: tiposEnum, description: "Snapshot (opcional)", bsonType: ["string", "null"] },
    descripcion: { bsonType: ["string", "null"] },
  },
};

const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["usuarioId", "nombreReceta"],
    additionalProperties: false,
    properties: {
      _id: {},
      usuarioId: { bsonType: "objectId", description: "Ref a usuarios" },
      nombreReceta: { bsonType: "string", minLength: 1, description: "Requerido" },
      descripcion: { bsonType: ["string", "null"] },
      ingredientes: {
        bsonType: "array",
        items: ingredientSubdoc,
        uniqueItems: false,
      },
      createdAt: { bsonType: ["date", "null"] },
      updatedAt: { bsonType: ["date", "null"] },
    },
  },
};

export async function initRecetas(db) {
  return upsertCollection(db, RECETAS, {
    validator,
    indexes: [
      { keys: { usuarioId: 1 } },
      { keys: { "ingredientes.ingredienteId": 1 } },
      { keys: { "ingredientes.nombre": 1 } },
    ],
  });
}
