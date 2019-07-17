const routes = require('express').Router();
const queries = require('../queries');

routes.get('/voices', async (req, res) => {
  const r = await queries.listVoices({limit: 100})
  res.status(200).send(r.rows)
});

routes.get("/voice/:id", async (req, res) => {
  const {id} = req.params;
  const r = await queries.getVoiceWithId(id);
  let voice = r.rows[0];
  let r2 = await queries.getPodcastsOfVoice(id);
  voice.podcasts = r2.rows;

  res.status(200).send(voice)
});

routes.post("/voices", async (req, res) => {
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
  const r = await queries.createVoice(h);
  let id = r.rows[0].id

  const voiceRes = await queries.getVoiceWithId(id)
  const voice = voiceRes.rows[0];
  let voiceId = voice.id;

  if (req.body.podcast_id) {
    const r2 = await queries.assignVoiceToPodcast(voiceId, req.body.podcast_id)
  } 
  res.status(200).send(voice)
});

module.exports = routes;