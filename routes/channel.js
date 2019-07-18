const routes = require('express').Router();
const queries = require('../queries');
const bodyParser = require('body-parser');
const images = require('../images')

let jsonParser = bodyParser.json()

routes.get("/channels", async (req, res) => {
  const r = await queries.listChannels({limit: 100});
  res.status(200).send(r.rows);
});

routes.get("/channel/:id", async (req, res) => {
  const {id} = req.params;
  const r = await queries.getChannelWithId(id)

  res.status(200).send(r)
});

routes.post("/channels", jsonParser, async (req, res) => {
  console.log(req.body)
  let {name, start_year, channel_art, language, description} = req.body;
  let channel = {
    name: name,
    start_year: start_year,
    channel_art: channel_art,
    language: language,
    description: description
  }
  let r;
  let id;
  try {
    r = await queries.createChannel(channel);
    res.status(200).send(r.rows[0])
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  } 
});

routes.post("/channel/:id/art", 
  images.multer.single("image"), 
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
      r = await queries.changeChannelImage(id, imageUrl);
      res.status(200).send(r.rows[0])
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  }
)

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

routes.patch("/channel/:id", jsonParser, async (req, res) => {
  let {id} = req.params

  let r = await queries.updateChannel(id, req.body)
  res.status(200).send(r.rows[0])
})

module.exports = routes;
