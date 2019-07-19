const {Storage} = require('@google-cloud/storage');

const CLOUD_BUCKET = "cd-audio";

const storage = new Storage({
  projectId: "podcaster"
});
const bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  return `https://storage.cloud.google.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }

  let gcsname;
  if (req.file.mimetype === "audio/mp3") {
    gcsname = "audio-files/" + Date.now() + "_" + req.file.originalname;
  } else {
    gcsname = "channel-art/" + Date.now() + "_" + req.file.originalname;
  }
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const imageMulter = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

const audioMulter = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
})
// [END multer]

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  imageMulter,
  audioMulter
};