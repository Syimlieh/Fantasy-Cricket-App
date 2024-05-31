const PlayerJson = require("../data/players.json");

const checkPlayers = ({ players, captain, viceCaptain }) => {
  // Check if captain and vice captain are included in the player list
  if (!players.includes(captain, viceCaptain)) {
    return {
      success: false,
      data: "Captain And Vice Captain are not in the Player List.",
      status: 400,
    };
  }

  let teamCount = {};
  let roleCount = {
    WICKETKEEPER: 0,
    BATTER: 0,
    "ALL-ROUNDER": 0,
    BOWLER: 0,
  };

  for (let player of players) {
    // Check if the selected player actually Exist.
    const playerData = PlayerJson.find((p) => p.Player === player);
    if (!playerData) {
      return {
        success: false,
        data: `Player ${player} does not exist in the database.`,
        status: 400,
      };
    }

    // Count Team members
    if (teamCount[playerData.Team]) {
      teamCount[playerData.Team]++;
    } else {
      teamCount[playerData.Team] = 1;
    }

    // Count Role
    if (playerData.Role in roleCount) {
      roleCount[playerData.Role]++;
    }
  }

  // Only 10 Playser can be selected from a Single Team
  for (let team in teamCount) {
    if (teamCount[team] > 10) {
      return {
        success: false,
        data: `More than 10 players selected from team ${team}.`,
        status: 400,
      };
    }
  }

  if (
    roleCount.WICKETKEEPER < 1 ||
    roleCount.WICKETKEEPER > 8 ||
    roleCount.BATTER < 1 ||
    roleCount.BATTER > 8 ||
    roleCount["ALL-ROUNDER"] < 1 ||
    roleCount["ALL-ROUNDER"] > 8 ||
    roleCount.BOWLER < 1 ||
    roleCount.BOWLER > 8
  ) {
    return {
      success: false,
      data: `Please ensure 1-8 players are selected for each role.`,
      status: 400,
    };
  }

  return {
    success: true,
    status: 200,
  };
};

module.exports = {
  checkPlayers,
};
