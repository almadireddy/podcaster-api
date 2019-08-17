const routes = require('express').Router();
const queries = require('../queries');

const bodyParser = require('body-parser');

routes.use(bodyParser.json())

routes.get('/guests', async (req, res) => {
  const r = await queries.listGuests({limit: 100})
  res.status(200).send(r.rows)
});

routes.get("/guest/:id", async (req, res) => {
  const {id} = req.params;
  const r = await queries.getGuestWithId(id);

  res.status(200).send(r)
});

routes.post("/guests", async (req, res) => {
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
  const r = await queries.createGuest(h);
  let id = r.rows[0].id

  const voiceRes = await queries.getGuestWithId(id)
  const voice = voiceRes.rows[0];
  let voiceId = voice.id;

  if (req.body.podcast_id) {
    const r2 = await queries.assignGuestToEpisode(voiceId, req.body.podcast_id)
  } 
  res.status(200).send(voice)
});

module.exports = routes;
