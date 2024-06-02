const TeamService = require("../services/team.service.js");
const { calculatePoints } = require("../utils/general.util.js");

const processResult = async (req, res) => {
  /*
    #swagger.tags = ['Result']
    #swagger.description = 'Process Result'
    #swagger.summary = 'Process Result'
  */
  const query = {
    totalPoints: null,
  };
  const fetchAllTeams = await TeamService.fetchAllTeams(query);
  if (!fetchAllTeams.success) {
    return res.status(fetchAllTeams.status).json({
      success: fetchAllTeams.success,
      data: fetchAllTeams.data,
    });
  }

  const teams = fetchAllTeams.data;
  for (const team of teams) {
    const { data, success } = calculatePoints(team);
    if (!success) {
      return res.status(400).json({
        success,
        data: data,
      });
    }

    // Update the current team points to the database
    const teamQuery = { _id: team._id };
    const updateResult = await TeamService.updateTeam(teamQuery, data);
    if (!updateResult.success) {
      return res.status(updateResult.status).json({
        success: updateResult.success,
        data: updateResult.data,
      });
    }
  }
  res.status(200).json({
    success: true,
    data: "Points calculated and updated successfully for all Existing teams.",
  });
};

const teamResult = async (req, res) => {
  res.send("Team Result");
};

module.exports = {
  processResult,
  teamResult,
};
