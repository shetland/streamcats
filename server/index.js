//APP
const express = require("express")
const app = express()

//ROUTES
const indexRoutes = require("./routes/index")
app.use(indexRoutes)

//==========================
app.listen("3000", "127.0.0.1", function(){
	console.log("Server listening on port 3000")
});