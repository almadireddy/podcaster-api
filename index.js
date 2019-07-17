const express = require("express");
const bodyParser = require('body-parser')
require('dotenv').config();

const routes = require('./routes')
const db = require("./db")
const app = express();

app.use(bodyParser.json())
app.use('/api', routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  db.initDb();
  console.log(`server running on port ${PORT}`)
});
