const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userModel = require('./api/model/user_schema');
const paperModel = require('./api/model/paper_schema');
const answerModel = require('./api/model/answer_schema')
const protectRoute = require('./api/middleware/protect');
const api = require('./api/routes/routes');
const cors = require('cors');
const app = express();
app.use(session({
    secret: process.env.JWT_KEY, 
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up CORS options
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with the request
}));

require('./api/db/db');

app.use('/api/route/user', api);

app.listen(process.env.PORT, () => {
    console.log(`server started on http://localhost:${process.env.PORT}`);
});
