const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/candidate", controller.candidate);
  app.post("/api/emailcheck", controller.emailcheck);
  app.get("/api/exportPdf",controller.exportPdf);
  app.post("/api/vote", controller.vote);
  app.get(
    "/api/result",
    [authJwt.verifyToken],
    controller.result
  );
};