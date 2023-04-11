const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();


const client = new OAuth2Client("426135309410-n5nro7nt328qpaul4oiansfu441ckcl8.apps.googleusercontent.com");

const checkGoogleAuth = async (req, res, next) => {


  console.log(req.headers)
  const token = req.headers.authorization;
  // const token = req.headers.authorization.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "426135309410-n5nro7nt328qpaul4oiansfu441ckcl8.apps.googleusercontent.com",
    });

    console.log(ticket.getPayload())

    const {name , email , sub, picture} = ticket.getPayload();
   
    req.user = {email : email,
                name: name,
                googleId : sub,
              picture : picture};

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  checkGoogleAuth,
};
