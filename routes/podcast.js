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
  const r = await queries.getPodcastWithId(req.params.id);
  let podcast = r.rows[0];

  const r2 = await queries.getVoicesInPodcast(req.params.id);
  podcast.voices = r2.rows;

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


module.exports = routes;