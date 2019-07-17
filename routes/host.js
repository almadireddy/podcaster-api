const routes = require('express').Router();
const queries = require('../queries');

routes.get('/hosts', async (req, res) => {
  const r = await queries.listHosts({limit: 100})
  res.status(200).send(r.rows)
});

routes.get("/host/:id", async (req, res) => {
const {id} = req.params;
  const r = await queries.getHostWithId(id);
  let host = r.rows[0];
  let r2 = await queries.getChannelsOfHost(id);
  host.channels = r2.rows;

  res.status(200).send(host)
});

routes.post("/hosts", async (req, res) => {
  let {name, bio, language, country, email, job_title, organization, orcid, website} = req.body;

  let h = {
    name: name, 
    bio: bio,
    language: language,
    country: country,
    email: email,
    job_title: job_title,
    organization: organization,
    orcid: orcid,
    website: website
  }
  const r = await queries.createHost(h);
  let id = r.rows[0].id

  const hostRes = await queries.getHostWithId(id)
  const host = hostRes.rows[0];
  let hostId = host.id;

  if (req.body.channel_id) {
    let channel_role = req.body.channel_role;
    const r2 = await queries.assignHostToChannel(hostId, req.body.channel_id, channel_role)
  } 
  res.status(200).send(host)
});

module.exports = routes;