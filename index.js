const express = require("express");
const bodyParser = require('body-parser')
var cors = require('cors')
let logger = require('morgan')
require('dotenv').config();

const admin = require("./fb-admin/admin")

const routes = require('./routes')
const db = require("./db")
const app = express();

app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  db.initDb();
  console.log(`server running on port ${PORT}`)
});
