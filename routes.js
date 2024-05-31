const { addTeam } = require("./controllers/team.controller.js");
const {
  processResult,
  teamResult,
} = require("./controllers/result.controller.js");

module.exports = (app) => {
  // teams Routes
  app.post("/add-team", addTeam);

  // Process result
  app.post("/process-result", processResult);

  // Team Result
  app.post("/team-result", teamResult);
};
