// Zona de importacion de modulos
import { upsertCollection } from "./utils.js";

export const INGREDIENTES = "ingredientes";

const tiposEnum = ["Vegetal", "Proteina", "Condimento", "Otro"];

const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["nombre", "tipo"],
    additionalProperties: false,
    properties: {
      _id: {},
      nombre: { bsonType: "string", minLength: 1, description: "Requerido (normalizado)" },
      tipo: { enum: tiposEnum, description: "Enum requerido" },
      descripcion: { bsonType: ["string", "null"] },
      createdAt: { bsonType: ["date", "null"] },
      updatedAt: { bsonType: ["date", "null"] },
    },
  },
};

export async function initIngredientes(db) {
  return upsertCollection(db, INGREDIENTES, {
    validator,
    indexes: [
      { keys: { nombre: 1 }, options: { unique: true, collation: { locale: "es", strength: 2 } } },
    ],
  });
}
