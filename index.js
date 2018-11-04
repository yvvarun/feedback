const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    //30 days in ms
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

/*
1. passport.initialize() is a middle-ware that initialises Passport.
2. Middlewares are functions that have access to the request object (req),
the response object (res), and the next middleware function in the application’s
request-response cycle.
3. Passport is an authentication middleware for Node that authenticates requests.
4. So basically passport.initialize() initialises the authentication module.
5. passport.session() is another middleware that alters the request object and
change the 'user' value that is currently the session id (from the client cookie)
into the true deserialized user object
*/
app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
