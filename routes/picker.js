const express = require('express');
const passport = require('passport');
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require('../models/User');

// GET requests

router.get('/user', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.send(null);
    }

    res.send(req.user);
});

router.get('/favourites', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.send([]);
    }

    res.send(req.user.favourites);
});

// POST requests

router.post('/register', (req, res) => {
    const password_regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;

    if (!password_regex.test(password) || !email_regex.test(email))
        return res.send('Invalid email or password');

    User.findOne({ email: email }).then(user => {
        if (user)
            return res.status(404).send('User already exists');

        const newUser = new User({
            name: name,
            email: email,
            password: password,
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    throw err;

                newUser.password = hash;
                newUser.save().then(user => res.status(200).send('Registered successfully'))
                                .catch(err => console.log(err));
            });
        });
    });    
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            throw err;

        if (!user)
            return res.status(404).send("User doesn't exist");

        req.logIn(user, (err) => {
            if (err)
                throw err;

            res.status(200).send(user);
        });
    })(req, res, next);
});

router.post('/logout', checkAuthenticated, (req, res) => {
    req.logout();
    res.send("Successfuly logged out");
});

router.post('/save', checkAuthenticated, (req, res) => {
    User.findOne({ name: req.user.name, email: req.user.email }, (err, doc) => {
        doc.favourites.push(req.body.movie);

        doc.save().then(() => res.send("Success"))
                  .catch(err => res.send(err));
    });
});

router.post('/remove', checkAuthenticated, (req, res) => {
    User.findOne({ name: req.user.name, email: req.user.email }, (err, doc) => {
        const compareMovies = (movie1, movie2) => {
            return JSON.stringify(movie1) === JSON.stringify(movie2);
        }

        let breakPoint = 0;
        while (breakPoint < req.user.favourites.length && 
               !compareMovies(req.user.favourites[breakPoint], req.body.movie)) {
            breakPoint++;
        }

        let left = doc.favourites.slice(0, breakPoint);
        let right = doc.favourites.slice( breakPoint + 1);

        doc.favourites = left.concat(right);

        doc.save().then(() => res.send("Success"))
                  .catch(err => res.send(err));
    });
});

function checkAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(403).send("User not authenticated");
    }

    return next();
}

module.exports = router;