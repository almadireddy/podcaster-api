const routes = require('express').Router();
const episodes = require('./episode');
const hosts = require('./host');
const podcast = require('./podcast');
const voice = require('./voice');
const bodyParser = require('body-parser');

routes.use(bodyParser.json())
routes.use('/', episodes)
routes.use('/', hosts)
routes.use('/', podcast)
routes.use("/", voice)

module.exports = routes
