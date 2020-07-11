const express = require("express")
const router = express.Router()
const connector = require("../tools/save_connect.js")
const picks = require("../data/picks/picks.json")
const dataKeys =  require("../encrypt/data/compkey/compressionKeys.json")
const hmdComp =  require("../encrypt/data/hulu/compHmd.json")
const htdComp =  require("../encrypt/data/hulu/compHtd.json")
const nmdComp =  require("../encrypt/data/netflix/compNmd.json")
const ntdComp =  require("../encrypt/data/netflix/compNtd.json")
const mp = require("msgpack-lite")


const keyPk = mp.encode(dataKeys)
const huluPk = mp.encode({"movies":hmdComp, "tv":htdComp})
const netflixPk = mp.encode({"movies":nmdComp, "tv":ntdComp})

router.get("/api", function(req, res){
  // connector.saveConnections(req.connection.remoteAddress)
	console.log('Got request from: ', req.connection.remoteAddress)
	if (req.query.cats === "mlk") {
		res.send(keyPk)
	} else {
		res.json({"meow": "When you meow into the abyss, the abyss meows back. <(o.o)>"});
	}
});

router.get("/api/:cat", function(req,res){
	console.log("Got request from: ", req.connection.remoteAddress)
	if (req.params.cat === "hulu" || req.params.cat === "netflix") {
		if (req.params.cat === "hulu" 
		&& req.query.cats === "mew"){
			res.send(huluPk)
		}
		if (req.params.cat === "netflix"
		&& req.query.cats === "mew") {
			res.send(netflixPk)
		}
	} else {
		res.json({"meow": "When you meow into the abyss, the abyss meows back. <(o.o)>"});
	}
});

router.get("/api/cat/picks", function(req,res){
  // connector.saveConnections(req.connection.remoteAddress)
	console.log("Got request from: ", req.connection.remoteAddress)
	res.send(picks)
});

module.exports = router;