// dataset.js (ESM)
// Semillas idempotentes para usuarios, ingredientes (catálogo) y recetas con subdocs denormalizados.

import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

// ========= Config =========
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "recetario_de_la_abuela";

// Normalización de strings (minúsculas + trim)
const norm = (s) => (s ?? "").toString().trim().toLowerCase();

// ========= Datos base =========
// 1) Usuarios (email único)
const USERS = [
  { nombreUsuario: "Brian Suarez", email: "brian.suarez@fimail.com" },
  { nombreUsuario: "Ana Pérez",    email: "ana.perez@fimail.com" },
  { nombreUsuario: "Carlos Gómez", email: "carlos.gomez@fimail.com" },
];

// 2) Ingredientes de catálogo (nombre único normalizado)
//   Tipos válidos: "Vegetal" | "Proteina" | "Condimento" | "Otro"
const INGREDIENTS_CATALOG = [
  { nombre: "arroz",     tipo: "Otro",      descripcion: "Grano base" },
  { nombre: "pollo",     tipo: "Proteina",  descripcion: "Pechuga o muslo" },
  { nombre: "cebolla",   tipo: "Vegetal" },
  { nombre: "ajo",       tipo: "Vegetal" },
  { nombre: "pimenton",  tipo: "Vegetal" },
  { nombre: "sal",       tipo: "Condimento" },
  { nombre: "pimienta",  tipo: "Condimento" },
  { nombre: "aceite",    tipo: "Otro" },
  { nombre: "tomate",    tipo: "Vegetal" },
  { nombre: "zanahoria", tipo: "Vegetal" },
  { nombre: "comino",    tipo: "Condimento" },
  { nombre: "lentejas",  tipo: "Otro" },
  { nombre: "lechuga",   tipo: "Vegetal" },
  { nombre: "limon",     tipo: "Otro" },
  { nombre: "arvejas",   tipo: "Vegetal" },
  { nombre: "huevo",     tipo: "Proteina" },
];

// 3) Recetas (6), repartidas entre usuarios, con 5–8 ingredientes c/u.
//    items[].nombre debe existir en el catálogo; descripcion es propia de la receta.
const RECIPES = [
  {
    ownerEmail: "brian.suarez@fimail.com",
    nombreReceta: "Arroz con pollo",
    descripcion: "Receta clásica con verduras.",
    items: [
      { nombre: "arroz", descripcion: "2 tazas de arroz blanco" },
      { nombre: "pollo", descripcion: "300 g en cubos" },
      { nombre: "cebolla", descripcion: "1/2 unidad picada" },
      { nombre: "ajo", descripcion: "2 dientes picados" },
      { nombre: "pimenton", descripcion: "1/2 unidad en tiras" },
      { nombre: "sal" },
      { nombre: "pimienta" },
      { nombre: "aceite", descripcion: "2 cucharadas" },
    ],
  },
  {
    ownerEmail: "ana.perez@fimail.com",
    nombreReceta: "Lentejas caseras",
    descripcion: "Cálidas y reconfortantes.",
    items: [
      { nombre: "lentejas", descripcion: "250 g remojadas" },
      { nombre: "cebolla", descripcion: "1/2 unidad" },
      { nombre: "ajo", descripcion: "2 dientes" },
      { nombre: "zanahoria", descripcion: "1 unidad en cubos" },
      { nombre: "tomate", descripcion: "1 unidad rallado" },
      { nombre: "comino", descripcion: "1/2 cucharadita" },
      { nombre: "sal" },
      { nombre: "aceite" },
    ],
  },
  {
    ownerEmail: "carlos.gomez@fimail.com",
    nombreReceta: "Ensalada fresca",
    descripcion: "Ligera y rápida.",
    items: [
      { nombre: "lechuga", descripcion: "Hojas lavadas" },
      { nombre: "tomate", descripcion: "1 unidad en gajos" },
      { nombre: "cebolla", descripcion: "En plumas" },
      { nombre: "aceite", descripcion: "1 cda" },
      { nombre: "sal" },
      { nombre: "limon", descripcion: "Jugo de 1/2 limón" },
    ],
  },
  {
    ownerEmail: "ana.perez@fimail.com",
    nombreReceta: "Pollo al horno",
    descripcion: "Crujiente por fuera, jugoso por dentro.",
    items: [
      { nombre: "pollo", descripcion: "Muslos con piel" },
      { nombre: "ajo", descripcion: "3 dientes machacados" },
      { nombre: "pimienta" },
      { nombre: "sal" },
      { nombre: "aceite", descripcion: "1 cda para pincelar" },
      { nombre: "comino", descripcion: "1/2 cucharadita" },
    ],
  },
  {
    ownerEmail: "carlos.gomez@fimail.com",
    nombreReceta: "Arroz a la jardinera",
    descripcion: "Colorido y vegetal.",
    items: [
      { nombre: "arroz", descripcion: "2 tazas" },
      { nombre: "zanahoria", descripcion: "1/2 en cubos" },
      { nombre: "arvejas", descripcion: "1/2 taza" },
      { nombre: "pimenton", descripcion: "1/2 en tiras" },
      { nombre: "cebolla", descripcion: "1/2 unidad" },
      { nombre: "sal" },
      { nombre: "aceite" },
    ],
  },
  {
    ownerEmail: "brian.suarez@fimail.com",
    nombreReceta: "Huevos pericos",
    descripcion: "Clásico desayuno.",
    items: [
      { nombre: "huevo", descripcion: "3 unidades batidas" },
      { nombre: "tomate", descripcion: "1/2 en cubos" },
      { nombre: "cebolla", descripcion: "1/4 picada finamente" },
      { nombre: "sal" },
      { nombre: "aceite" },
    ],
  },
];

// ========= Seed principal =========
async function seed() {
  if (!uri) throw new Error("Falta MONGODB_URI en .env");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const Usuarios = db.collection("usuarios");
  const Ingredientes = db.collection("ingredientes");
  const Recetas = db.collection("recetas");

  // Índices (crear si no existen)
  await Usuarios.createIndex({ email: 1 }, { unique: true });
  await Ingredientes.createIndex(
    { nombre: 1 },
    { unique: true, collation: { locale: "es", strength: 2 } } // CI por mayúsculas/minúsculas
  );
  await Recetas.createIndex({ usuarioId: 1 });
  await Recetas.createIndex({ "ingredientes.ingredienteId": 1 });
  await Recetas.createIndex({ "ingredientes.nombre": 1 });

  const now = new Date();

  // 1) Upsert Usuarios
    const userIdByEmail = new Map();
    for (const u of USERS) {
    const email = norm(u.email);

    const resUser = await Usuarios.findOneAndUpdate(
        { email },
        {
        $set: {
            nombreUsuario: u.nombreUsuario.trim(),
            email,
            updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
        },
        { upsert: true, returnDocument: "after" }
    );

    // Fallback si resUser.value viene undefined según versión/comportamiento
    const userDoc = resUser?.value || (await Usuarios.findOne({ email }));
    if (!userDoc) {
        throw new Error(`No se pudo upsert el usuario: "${email}"`);
    }

    userIdByEmail.set(email, userDoc._id);
    }

// 2) Upsert Ingredientes (catálogo)
const ingredientByName = new Map();
for (const ing of INGREDIENTS_CATALOG) {
  const nombre = norm(ing.nombre);
  const tipo = ing.tipo;
  const descripcion = ing.descripcion?.trim() || null;

  const res = await Ingredientes.findOneAndUpdate(
    { nombre },
    {
      $set: { nombre, tipo, descripcion, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    {
      upsert: true,
      returnDocument: "after",
      collation: { locale: "es", strength: 2 },
    }
  );

  // Asegura que tengamos el documento, aunque 'value' viniera nulo por versión/opción
  const doc =
    res?.value ||
    (await Ingredientes.findOne({ nombre }, { collation: { locale: "es", strength: 2 } }));

  if (!doc) {
    throw new Error(`No se pudo upsert el ingrediente de catálogo: "${nombre}"`);
  }

  ingredientByName.set(nombre, doc);
}

// Depuración: compara keys del catálogo vs. recetas
const catalogKeys = new Set([...ingredientByName.keys()]);
const missing = new Set();
for (const r of RECIPES) {
  for (const it of r.items) {
    const k = norm(it.nombre);
    if (!catalogKeys.has(k)) missing.add(k);
  }
}
if (missing.size) {
  console.warn("Ingredientes NO encontrados en catálogo:", [...missing]);
}

  // 3) Upsert Recetas (por par: usuarioId + nombreReceta)
  let insertedOrUpdated = 0;
  for (const r of RECIPES) {
    const email = norm(r.ownerEmail);
    const usuarioId = userIdByEmail.get(email);
    if (!usuarioId) {
      console.warn(`Usuario no encontrado para receta: ${r.nombreReceta} (${email})`);
      continue;
    }

    // Construir subdocs de ingredientes desde el catálogo + descripción específica de receta
    const subdocs = [];
    for (const item of r.items) {
    const nombreKey = norm(item.nombre);
    const cat = ingredientByName.get(nombreKey);

    if (!cat) {
        // Falla explícitamente con el ingrediente problemático
        throw new Error(
        `Ingrediente faltante en catálogo: "${item.nombre}" (normalizado: "${nombreKey}"). ` +
        `Revisa que exista en INGREDIENTS_CATALOG y que la normalización coincida.`
        );
    }

    subdocs.push({
        _id: new ObjectId(),
        ingredienteId: cat._id,
        nombre: cat.nombre, // snapshot normalizado
        tipo: cat.tipo,     // snapshot
        descripcion: item.descripcion?.trim() || cat.descripcion || null,
    });
    }

    const filter = { usuarioId, nombreReceta: r.nombreReceta.trim() };
    const { value } = await Recetas.findOneAndUpdate(
      filter,
      {
        $set: {
          usuarioId,
          nombreReceta: r.nombreReceta.trim(),
          descripcion: r.descripcion?.trim() || null,
          ingredientes: subdocs,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );

    insertedOrUpdated += 1;
  }

  // 4) Resumen
  const [uCount, iCount, rCount] = await Promise.all([
    Usuarios.countDocuments(),
    Ingredientes.countDocuments(),
    Recetas.countDocuments(),
  ]);

  console.log("✅ Seed completado");
  console.table({
    "Usuarios (total)": uCount,
    "Ingredientes (total)": iCount,
    "Recetas (total)": rCount,
    "Recetas upsert en esta corrida": insertedOrUpdated,
  });

  await client.close();
}

// Ejecutar
seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
