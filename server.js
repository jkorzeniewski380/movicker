const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('cookie-session');
const passport = require('passport');

const app = express();
const routes = require('./routes/picker');
const PORT = process.env.PORT || 8080;

const initializePassport = require('./authentication/passport-config');
initializePassport(passport);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/movie-picker";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production')
    app.use(express.static('client/build'));

app.use('/', routes);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
