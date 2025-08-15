# Plataforma de Recetas Culinarias

Desarrollar una API REST para una **Plataforma de Recetas Culinarias** donde los usuarios puedan registrarse, agregar sus recetas y detallar sus ingredientes, así como buscar recetas por ingrediente y consultar las recetas creadas por un usuario en particular.

---

## **Contexto funcional**

Tu equipo ha sido contratado para desarrollar una API que será la base de una futura aplicación web de recetas. El sistema debe permitir:

1. **Gestión de usuarios**
    - Registrar nuevos usuarios en la plataforma.
    - Consultar la lista de todos los usuarios registrados.
    - Ver la información detallada de un usuario en específico.
    - Actualizar los datos de un usuario.
    - Eliminar un usuario y todas sus recetas asociadas.
2. **Gestión de recetas**
    - Permitir que un usuario pueda registrar una nueva receta con su título y descripción.
    - Listar todas las recetas disponibles en la plataforma.
    - Consultar una receta en específico con todos sus ingredientes.
    - Editar el título o descripción de una receta.
    - Eliminar una receta.
    - **Listar todas las recetas que pertenecen a un usuario específico** (ej. “ver todas las recetas de Juan Pérez”).
3. **Gestión de ingredientes**
    - Agregar ingredientes a una receta existente (cada ingrediente tendrá un nombre y estará vinculado a una receta).
    - Ver todos los ingredientes de una receta.
    - Eliminar ingredientes de una receta.
    - **Buscar todas las recetas que contengan un ingrediente específico** (ej. “pollo” muestra todas las recetas que lo usan).

---

## **Requerimientos técnicos**

1. El proyecto debe estar desarrollado con **Node.js, Express, MongoDB y Dotenv**.
2. La conexión a la base de datos debe estar en un archivo separado y reutilizable.
3. Debe tener rutas organizadas por funcionalidad.
4. Incluir un **script de inicialización** (`dataset.js`) que inserte datos de prueba.
5. Documentar **cada endpoint** en el README con:
    - Método HTTP.
    - URL.
    - Descripción funcional.
    - Ejemplo de request y response (puede ser en JSON).
6. El código debe manejar errores y devolver mensajes claros al usuario.

---

## **Entregables**

- **Repositorio en GitHub** con:
    - Código fuente.
    - README documentado con instrucciones y endpoints.
- **Video demostrativo** (máx. 10 minutos y con cámara activa de todos los integrantes) usando **Insomnia o Postman**, mostrando:
    - Ejecución de cada operación solicitada.
    - Búsqueda por ingrediente.
    - Listado de recetas por usuario.

⚠️ El link del video debe agregarse en el Readme

---

## **Modalidad de trabajo**

- Grupos de **máximo 3 personas**.
- Todos los integrantes deben aparecer en el README con nombre completo.

---

# Entrega

Jueves 14 de agosto de 2025 a las 11:59:59 p.m.