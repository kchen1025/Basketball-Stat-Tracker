const express = require("express");
const playersController = require("../controllers/playersController");
const miscController = require("../controllers/miscController");
const teamController = require("../controllers/teamController");
const dashboardController = require("../controllers/dashboardController");
const actController = require("../controllers/actController");
const router = express.Router();

router.get("/players", playersController.getPlayers);
router.get("/dashboard", dashboardController.getAllPlayerStats);
router.get("/emoji", miscController.getEmoji);
router.get("/games", miscController.getGames);

router.get("/game/:gameId", miscController.getGame);
router.get("/game-meta-data/:gameId", miscController.getGameMetaData);
router.get("/game-log/:gameId", miscController.getGameLog);

router.post("/create-game", miscController.createGame);
router.post("/team", teamController.createTeam);
router.post("/teams", teamController.createTeams);
router.post("/act", actController.createAct);

module.exports = router;
