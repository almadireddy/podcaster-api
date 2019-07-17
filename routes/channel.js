const routes = require('express').Router();
const queries = require('../queries');

routes.post("/channels", async (req, res) => {
  let {name, start_year, channel_art, language, description} = req.body;
  let channel = {
    name: name,
    start_year: start_year,
    channel_art: channel_art,
    language: language,
    description: description
  }
  const r = await queries.createChannel(channel);
  id = r.rows[0].id
  const ch = await queries.getChannelWithId(id)
  res.status(200).send(ch.rows[0])
});

routes.get("/channels", async (req, res) => {
  const r = await queries.listChannels({limit: 100});
  res.status(200).send(r.rows);
});

routes.put("/channel/:id/hosts", async (req, res) => {
  // send in array of host objects
  let {hosts} = req.body;
  const {id} = req.params;

  for (const host of hosts) {
    let hostId;
    if (!host.id) {
      const createHost = await queries.createHost(host)
      hostId = createHost.rows[0].id
    } else {
      hostId = host.id;
    }
    const r = await queries.assignHostToChannel(hostId, id, host.channel_role);
  }

  const updatedChannel = await queries.getChannelWithId(id)

  res.status(200).send(updatedChannel)
});

routes.get("/channel/:id", async (req, res) => {
  const {id} = req.params;
  const r = await queries.getChannelWithId(id)

  res.status(200).send(r)
});

module.exports = routes;