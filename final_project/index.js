require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({secret:process.env.SESSION_SECRET, resave: true, saveUninitialized: true}))

function getTokenRemainingTime(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
        throw new Error('Invalid token');
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = decoded.exp - currentTime;

        if (remainingTime <= 0) {
        return 'Token has expired';
        }

        return `Remaining time: ${remainingTime} seconds`;
    } catch (err) {
        return `Error: ${err.message}`;
    }
}



// Middleware to authenticate requests to "/customer/auth" endpoint
app.use("/customer/auth/*", function auth(req,res,next){

    const token = req.session.token;

     // Check if user is logged in and has valid access token
     if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;

                console.log("Middelware :)")
                const remainingTime = getTokenRemainingTime(token);
                console.log(remainingTime);
                
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running in PORT " + PORT));
