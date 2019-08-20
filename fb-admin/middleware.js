const admin = require("firebase-admin");

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if(decodedToken) {
      req.body.uid = decodedToken.uid;
      return next();
    } else {
      return res.status(401).send("Unauthorized")
    }
  } catch (e) {
    console.error(e)
    return res.status(401).send("Unauthorized request caught!")
  }
}

module.exports = verifyToken;
