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

const MONGODB_URI = "mongodb+srv://movieAdmin:WOLkLwyMRsXwvKxy@cluster0.vdi5p.mongodb.net/movie-picker?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use(session({
    secret: 'guweh1293845nsp2h12hf98auh173pasojf31',
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
