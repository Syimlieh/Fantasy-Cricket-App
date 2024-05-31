const TeamService = require("../services/team.service.js");
const { checkPlayers } = require("../utils/general.util.js");

const addTeam = async (req, res) => {
  /*
    #swagger.tags = ['Team']
    #swagger.description = 'Create a new Team'
    #swagger.summary = 'Create a new Team'

    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'Team Detail Object',
      schema: {
        $teamName: "Winner Team",
        $players: [
          "MS Dhoni", "MJ Santner", "RD Gaikwad", "DP Conway", "N Jagadeesan", "Simarjeet Singh",
          "YBK Jaiswal", "JC Buttler", "SV Samson", "D Padikkal", "R Parag"
        ],
        $captain: "MS Dhoni",
        $viceCaptain: "Robin Uthappa"
      }
    }
  */
  // Assuming we only have 1 user
  // In a real world application, we will use playerId instead of Name
  const payload = req.body;

  const checkSelectedPlayers = checkPlayers(payload);
  if (!checkSelectedPlayers.success) {
    return res.status(checkSelectedPlayers.status).json({
      success: checkSelectedPlayers.success,
      data: checkSelectedPlayers.data,
    });
  }

  const result = await TeamService.addTeam(payload);
  return res.status(result.status).json({
    success: result.success,
    data: result.data,
  });
};

module.exports = {
  addTeam,
};
