// This file is responsible for configuring Passport.js to use the Google OAuth 2.0 strategy for user authentication in the application
import "./config/passport.js";

//importing the api routes which handles the main application logic that is protected and requires authentication
import apiRoutes from "./routes/api.js";

//importing the auth routes which handles the authentication process using Google OAuth 2.0
import authRoutes from "./routes/auth.js";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";

//Load environment variables from a .env file into process.env like API keys and secrets client ID, client secret, and callback URL
dotenv.config();

//Create an instance of an Express application to set up the server and define routes and middleware
const app = express();

// import path module to work with file and directory paths
import path from "path";
// import fileURLToPath to convert module URL to file path
import { fileURLToPath } from "url";
// __filename and __dirname are not available in ES modules, so we create them manually
const __filename = fileURLToPath(import.meta.url);
// get the directory name of the current module file
const __dirname = path.dirname(__filename);

// This tells Express to serve files from the "frontend" folder
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

//Create an instance of an Express application to set up the server and define routes and middleware
app.use(passport.initialize());

//Middleware to parse incoming JSON requests and populate req.body with the parsed data
app.use(express.json());
// Middleware to enable CORS (Cross-Origin Resource Sharing) to allow requests from the frontend application

app.use(cors({
    //Allow requests from the frontend application URL specified in the environment variables
    origin : process.env.FRONTEND_URL, credentials : true
}));

//Routes to handle authentication and API requests
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

//Define a simple route for the root URL ("/") that sends a response indicating that the server is running
app.get("/", (req,res) => res.send("Google OAuth + JWT Server Running.... "));

//Connect to MongoDB using Mongoose and start the server
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("MongoDB Connected....");
    //Start the server and listen on the specified port from environment variables
    app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
}).catch((err) => console.error(" DB Connection Error: ", err));


/*  API Endpoints Summary:
1. GET /
    Purpose: Health check
    Who hits it: Browser / Postman (manual check)
    Response:
    Google OAuth + JWT Server Running....

2. GET /auth/test
    Purpose: Test if auth routing works
    Who hits it: Developer (Postman / browser)
    Response:
    Auth route is connected and working properly

3. GET /auth/google
    Purpose: Start Google OAuth login
    Who hits it: Frontend (Login with Google button)
    What happens:
        Redirects user to Google’s consent screen

4. GET /auth/google/callback

    Purpose: Google redirects here after login
    Who hits it: Google (after user signs in)
    What happens:
        Google user is authenticated
        JWT token is generated
    User is redirected to frontend with token in URL
    Eg : FRONTEND_URL/success.html?token=JWT_TOKEN

5. GET /api/me
    Purpose: Get logged-in user profile
    Who hits it: Frontend (after login)

*/