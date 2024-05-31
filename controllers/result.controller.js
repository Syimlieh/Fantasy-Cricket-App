const ResultService = require("../services/result.service.js");

const processResult = async (req, res) => {
  res.send("Process Result");
};

const teamResult = async (req, res) => {
  res.send("Team Result");
};

module.exports = {
  processResult,
  teamResult,
};
