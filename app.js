const express = require("express");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB ERROR: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get requirements according to user query

const hasPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const hasCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let todoQuery = "";
  const { search_q = "", priority, category, status } = request.query;

  switch (true) {
    case hasPriorityAndStatus(request.query):
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%' AND 
            priority= '${priority}' AND status= ${status};`;
      break;
    case hasCategoryAndPriority(request.query):
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%' AND
            priority= '${priority}' AND category= '${category}';`;
      break;
    case hasCategoryAndStatus(request.query):
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%' AND category= '${category}'
            AND status= '${status}';`;
      break;
    case hasPriority(request.query):
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%' AND priority= '${priority}';`;
      break;
    case hasCategory(request.query):
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%' AND category= '${category}'`;
      break;
    case hasStatus(request.query):
      todoQuery = `
          SELECT * FROM todo WHERE search_q= '%${search_q}%' AND status= '%${status}%';`;
      break;
    default:
      todoQuery = `
            SELECT * FROM todo WHERE search_q= '%${search_q}%';`;
      break;

      data = await db.all(todoQuery);
      response.send(data);
  }
});

module.exports = app;
