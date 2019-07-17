const routes = require('express').Router();
const queries = require('../queries');

routes.get("/podcasts", async (req, res) => {
  let r;
  
  if (req.query.channel_id !== undefined) {
    r = await queries.getPodcastsWithChannelId(req.query.channel_id, {limit: 100});
  } else {
    r = await queries.listPodcasts({
      limit: 100
    })
  }

  res.status(200).send(r.rows)
});

routes.get("/podcast/:id", async (req, res) => {
  const podcast = await queries.getPodcastWithId(req.params.id);
  res.status(200).send(podcast);
});

routes.post("/podcasts", async (req, res) => {
  let {title, description, url, language, channel_id} = req.body;
  let podcast = {
    title: title,
    description: description,
    url: url,
    language: language,
    channel_id: channel_id
  }
  const r = await queries.createPodcast(podcast);
  id = r.rows[0].id
  const r2 = await queries.getPodcastWithId(id, {limit: 100})
  res.status(200).send(r2.rows[0])
});

routes.put("/podcast/:id/voices", async (req, res) => {
  let {voices} = req.body;
  const {id} = req.params;

  for (const voice of voices) {
    let voiceId;
    if (!voice.id) {
      const newVoice = await queries.createVoice(voice);
      voiceId = newVoice.rows[0].id
    } else {
      voiceId = voice.id;
    }

    const r = await queries.assignVoiceToPodcast(voiceId, id)
  }

  const updatedPodast = await queries.getPodcastWithId(id)
  res.status(200).send(updatedPodast);
});

module.exports = routes;
