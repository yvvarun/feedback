const passport = require("passport");

/*
OAuth2.0 flow:
section 3, lec 17
1. user tries to login by: localhost:5000/auth/google
2. the route /auth/google is handled by calling passport.authenticate
3. when this call is made, google will first ask user if they grant permission.
4. google will then redirect to localhost:5000/auth/google/callback
   because we provided that as part of passport.use (new GoogleStrategy).
   google will also send a code which will be used to get user information.
   this code is stored by passport.
5. so passport.authenticate will be called again with that code
6. finally, the callback function which we provided as part of passport.use
   (check passport.js) will be called. there we're logging access token,
   refresh token, user info.
*/
module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"));

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
