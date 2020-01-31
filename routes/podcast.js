const routes = require('express').Router();
const queries = require('../queries');
const bodyParser = require('body-parser');
const images = require('../images')
const verifyToken = require("../fb-admin/middleware")

let jsonParser = bodyParser.json()

routes.get("/podcasts", async (req, res) => {
  const r = await queries.listPodcasts({limit: 100});
  res.status(200).send(r.rows);
});

routes.get("/podcast/:id", async (req, res) => {
  const {id} = req.params;
  const r = await queries.getPodcastWithId(id)

  res.status(200).send(r)
});

routes.post("/podcasts", jsonParser, verifyToken,  async (req, res) => {
  console.log(req.body)
  let {name, start_year, podcast_art, language, description} = req.body;
  let podcast = {
    name: name,
    start_year: start_year,
    podcast_art: podcast_art,
    language: language,
    description: description
  }
  let r;
  let id;
  try {
    r = await queries.createPodcast(podcast);
    res.status(200).send(r.rows[0])
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  } 
});

routes.post("/podcast/:id/art", 
  verifyToken,
  images.imageMulter.single("image"), 
  images.sendUploadToGCS,
  async (req, res) => {
    let {id} = req.params
    let imageUrl;

    if (req.file && req.file.cloudStoragePublicUrl) {
      imageUrl = req.file.cloudStoragePublicUrl;
      console.log(imageUrl)
    } else {
      console.log(req.file)
      res.status(500).send("there was a problem")
      return;
    }

    try {
      r = await queries.changePodcastImage(id, imageUrl);
      res.status(200).send(r.rows[0])
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  }
)

routes.put("/podcast/:id/hosts", jsonParser, verifyToken, async (req, res) => {
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
    const r = await queries.assignHostToPodcast(hostId, id, host.podcast_role);
  }

  const updatedChannel = await queries.getPodcastWithId(id)

  res.status(200).send(updatedChannel)
});

routes.put("/podcast/:id/episodes", jsonParser, verifyToken, async (req, res) => {
  // send in array of host objects
  let {episodes} = req.body;
  const {id} = req.params;

  if (episodes) {
    for (const episode of episodes) {
      let episodeId;
      if (!episode.id) {
        const createEpisode = await queries.createEpisode(episode)
        episodeId = createEpisode.rows[0].id
      } else {
        episodeId = episode.id;
      }
      const r = await queries.assignEpisodeToPodcast(Number(episodeId), Number(id));
    }
  }

  const updatedChannel = await queries.getPodcastWithId(id)

  res.status(200).send(updatedChannel)
});

routes.patch("/podcast/:id", jsonParser, verifyToken, async (req, res) => {
  let {id} = req.params

  let r = await queries.updatePodcast(id, req.body)
  res.status(200).send(r.rows[0])
})

module.exports = routes;
