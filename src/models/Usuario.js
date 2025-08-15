// Zona de importacion de modulos
import { upsertCollection } from "./utils.js";

export const USUARIOS = "usuarios";

const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["nombreUsuario", "email"],
    additionalProperties: false,
    properties: {
      _id: {},
      nombreUsuario: { bsonType: "string", minLength: 1, description: "Requerido" },
      email: { bsonType: "string", pattern: emailPattern, description: "Requerido" },
      createdAt: { bsonType: ["date", "null"] },
      updatedAt: { bsonType: ["date", "null"] },
    },
  },
};

export async function initUsuarios(db) {
  return upsertCollection(db, USUARIOS, {
    validator,
    indexes: [
      { keys: { email: 1 }, options: { unique: true, collation: { locale: "es", strength: 2 } } },
    ],
  });
}
