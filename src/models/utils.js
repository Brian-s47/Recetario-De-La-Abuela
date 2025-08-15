// Funcion para que los validadores de los models funcionen asi ya esten creados 
export async function upsertCollection(db, name, { validator, indexes = [] }) {
    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) {
    await db.createCollection(name, {
        validator,
        validationLevel: "strict",
        validationAction: "error",
    });
    } else {
    await db.command({
        collMod: name,
        validator,
        validationLevel: "strict",
        validationAction: "error",
    });
    }
    const coll = db.collection(name);
    for (const { keys, options } of indexes) {
    await coll.createIndex(keys, options);
    }
    return coll;
}
