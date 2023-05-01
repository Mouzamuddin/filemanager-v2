const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const googleClientId = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(googleClientId);

const checkGoogleAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const { name, email, sub, picture } = ticket.getPayload();

    req.user = { email: email, name: name, googleId: sub, picture: picture };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  checkGoogleAuth,
};
