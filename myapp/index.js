const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "sampledata.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () => {
      console.log("Server started");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initializeDbAndServer();

convertToPascal = (each) => {
  const { user_id, id, title, body } = each;
  return {
    userId: user_id,
    id,
    title,
    body,
  };
};

app.post("/add-multiple/", async (request, response) => {
  const givenData = request.body;

  let valueList = givenData.map((each) => {
    const { userId, id, title, body } = each;
    return `(${userId},${id},'${title}', '${body}')`;
  });

  valueList = valueList.filter((each) => each.includes(undefined) === false);

  const valueListString = valueList.join(",");

  const query = `INSERT INTO data (user_id,id,title,body)
               VALUES ${valueListString}`;
  await db.run(query);
  response.send("success");
});

app.post("/add-data/", async (request, response) => {
  const { userId, id, title, body } = request.body;
  const query = `INSERT INTO data (user_id,id,title,body)
         VALUES (${userId},${id},'${title}','${body}')`;
  await db.run(query);
  response.send("success");
});

app.get("/", async (request, response) => {
  const query = `SELECT * FROM data`;
  const data = await db.all(query);
  const convertedData = data.map((each) => convertToPascal(each));
  response.send(convertedData);
});
