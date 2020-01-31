const routes = require('express').Router();
const queries = require('../queries');
const verifyToken = require("../fb-admin/middleware")
const bodyParser = require('body-parser');

routes.use(bodyParser.json())

routes.get('/hosts', async (req, res) => {
  const r = await queries.listHosts({limit: 100})
  res.status(200).send(r.rows)
});

routes.get("/host/:id", async (req, res) => {
  const {id} = req.params;
  const host = await queries.getHostWithId(id);
  
  res.status(200).send(host)
});

routes.post("/hosts", verifyToken, async (req, res) => {
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
  const host = hostRes;
  let hostId = host.id;

  if (req.body.channel_id) {
    for (const r of req.body.channel_id) {
      const r2 = await queries.assignHostToPodcast(hostId, r, "")
    }
  } 
  res.status(200).send(host)
});

module.exports = routes;
