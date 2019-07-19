const routes = require('express').Router();
const queries = require('../queries');
const audio = require("../audio");

routes.get("/episodes", async (req, res) => {
  let r;
  
  if (req.query.channel_id !== undefined) {
    r = await queries.getEpisodesWithPodcastId(req.query.channel_id, {limit: 100});
  } else {
    r = await queries.listEpisodes({
      limit: 100
    })
  }

  res.status(200).send(r.rows)
});

routes.get("/episode/:id", async (req, res) => {
  const episode = await queries.getEpisodeWithId(req.params.id);
  res.status(200).send(episode);
});

routes.post("/episodes", async (req, res) => {
  let {title, description, url, language, podcast_id} = req.body;
  let episode = {
    title: title,
    description: description,
    url: url,
    language: language,
    podcast_id: podcast_id
  }
  const r = await queries.createEpisode(episode);
  id = r.rows[0].id
  const r2 = await queries.getEpisodeWithId(id, {limit: 100})
  res.status(200).send(r2)
});

routes.post("/episode/:id/audio", 
  audio.multer.single("audio"), 
  audio.sendUploadToGCS,
  async (req, res) => {
    let {id} = req.params
    let audioUrl;

    if (req.file && req.file.cloudStoragePublicUrl) {
      audioUrl = req.file.cloudStoragePublicUrl;
      console.log(audioUrl)
    } else {
      console.log(req.file)
      res.status(500).send("there was a problem")
      return;
    }

    try {
      r = await queries.changeEpisodeAudio(id, audioUrl);
      res.status(200).send(r.rows[0])
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  }
)


routes.put("/episode/:id/voices", async (req, res) => {
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
