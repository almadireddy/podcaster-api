const routes = require('express').Router();
const podcasts = require('./podcast');
const hosts = require('./host');
const channel = require('./channel');
const voice = require('./voice');

routes.use('/', podcasts)
routes.use('/', hosts)
routes.use('/', channel)
routes.use("/", voice)

module.exports = routes