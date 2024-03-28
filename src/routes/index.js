const express = require("express");
const playersController = require("../controllers/playersController");
const miscController = require("../controllers/miscController");
const teamController = require("../controllers/teamController");
const dashboardController = require("../controllers/dashboardController");
const actController = require("../controllers/actController");
const advancedAnalyticsController = require("../controllers/advancedAnalyticsController");
const gameController = require("../controllers/gameController");
const router = express.Router();

router.get("/players", playersController.getPlayers);
router.get("/players/career-highs", playersController.getCareerHighs);
router.post("/player", playersController.createPlayer);
router.get("/player/:playerId/points", playersController.getPointsByPlayer);

router.get("/dashboard", dashboardController.getAllPlayerStats);
router.get("/emoji", miscController.getEmoji);
router.get("/games", miscController.getGames);

router.get("/game/:gameId", miscController.getGame);
router.delete("/game/:gameId", gameController.deleteGame);

router.get("/game-meta-data/:gameId", miscController.getGameMetaData);
router.get("/game-log/:gameId", miscController.getGameLog);

router.get(
  "/win-rate-with-player",
  advancedAnalyticsController.getWinRateWithPlayersLeaderboard
);
router.get(
  "/win-rate-against-player/:playerId",
  advancedAnalyticsController.getWinRateAgainstPlayer
);

router.post("/create-game", miscController.createGame);
router.post("/team", teamController.createTeam);
router.post("/teams", teamController.createTeams);
router.post("/act", actController.createAct);

module.exports = router;
