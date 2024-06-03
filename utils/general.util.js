const PlayerJson = require("../data/players.json");
const MatchData = require("../data/match.json");

const checkPlayers = ({ players, captain, viceCaptain }) => {
  if (captain === viceCaptain) {
    return {
      success: false,
      data: "Captain And Vice Captain cannot be the same.",
      status: 400,
    };
  }
  // Check if captain and vice captain are included in the player list
  if (
    !players.some((p) => p.name === captain) ||
    !players.some((p) => p.name === viceCaptain)
  ) {
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
    const playerData = PlayerJson.find((p) => p.Player === player.name);
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

const calculatePoints = (team) => {
  const points = {};
  const catches = {};
  const runsScored = {};
  const wicketsTaken = {};
  const maidensBowled = {};

  const players = team.players.map((item) => item.name);
  players.forEach((player) => {
    points[player] = 0;
    catches[player] = 0;
    runsScored[player] = 0;
    wicketsTaken[player] = 0;
    maidensBowled[player] = 0;
  });

  MatchData.forEach((delivery) => {
    const {
      batter,
      bowler,
      fielders_involved: fielder,
      batsman_run,
      isWicketDelivery,
      player_out,
      kind,
    } = delivery;

    // Batting points
    if (players.includes(batter)) {
      runsScored[batter] += batsman_run;

      if (batsman_run > 0) points[batter] += 1; // Run
      if (batsman_run === 4) points[batter] += 1; // Boundary Bonus
      if (batsman_run === 6) points[batter] += 2; // Six Bonus

      // Check for duck dismissal
      if (isWicketDelivery && player_out === batter) {
        points[batter] -= 2;
      }
    }

    // Bowling points
    if (players.includes(bowler)) {
      // In the rules wicket and bonus have two diff point
      // So i am assuming that any out except by run_out. Point will be givent to bowler.
      if (isWicketDelivery && kind !== "run_out") {
        points[bowler] += 25; // Wicket
        if (["bowled", "lbw", "caught and bowled"].includes(kind)) {
          points[bowler] += 8; // Bonus
        }
        wicketsTaken[bowler] += 1;
      }
    }

    // Fielding points
    if (fielder && players.includes(fielder)) {
      if (kind === "caught") {
        points[fielder] += 8;
        catches[fielder] += 1;
      }
      // Not sure for these two. Not found in data.
      if (kind === "stumping") {
        points[fielder] += 12; // Stumping
      }
      if (kind === "run_out") {
        points[fielder] += 6; // Run out
      }
    }
  });

  Object.keys(catches).forEach((player) => {
    if (catches[player] >= 3) {
      points[player] += 4; // 3 Catch Bonus
    }
  });

  // Add bonuses for runs scored
  Object.keys(runsScored).forEach((player) => {
    if (runsScored[player] >= 30 && runsScored[player] < 50)
      points[player] += 4; // 30 Run Bonus
    if (runsScored[player] >= 50 && runsScored[player] < 100)
      points[player] += 8; // Half-century Bonus
    if (runsScored[player] >= 100) points[player] += 16; // Century Bonus
  });

  // wicket Count
  Object.keys(wicketsTaken).forEach((player) => {
    if (wicketsTaken[player] === 3) points[player] += 4;
    if (wicketsTaken[player] === 4) points[player] += 8;
    if (wicketsTaken[player] >= 5) points[player] += 16;
  });

  // Adjust points for captain and vice-captain
  const { captain, viceCaptain } = team;
  if (points[captain]) points[captain] *= 2;
  if (points[viceCaptain]) points[viceCaptain] *= 1.5;

  const totalPoints = Object.values(points).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const playerPointsArray = Object.keys(points).map((player) => ({
    name: player,
    points: points[player],
  }));

  let result = { players: playerPointsArray, totalPoints };
  return { success: true, data: result, status: 200 };
};

module.exports = {
  checkPlayers,
  calculatePoints,
};
