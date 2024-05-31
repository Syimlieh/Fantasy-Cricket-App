const { collection } = require("../db/collections.db");
const { connectDB, getDB } = require("../db/connect");

const addTeam = async (payload) => {
  await connectDB();
  const db = getDB();
  try {
    const newTeamPlayer = await db
      .collection(collection.TEAMS)
      .insertOne(payload);
    if (!newTeamPlayer) {
      return {
        success: false,
        data: "Failed While Trying to Save Team.",
        status: 400,
      };
    }
    return {
      success: false,
      data: "Team Created Successfully.",
      status: 201,
    };
  } catch (error) {
    return {
      success: false,
      data: "Failed While Trying to Save Team. Something Went Wrong.",
      status: 500,
    };
  }
};

module.exports = {
  addTeam,
};
