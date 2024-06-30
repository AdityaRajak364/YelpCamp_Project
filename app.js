if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const { stat } = require('fs');
const joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const userRoutes = require('./routes/users.js');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews.js');
const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//To parse the req.body(empty by default)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));//TELLING EXPRESS TO SERVE OUR PUBLIC DIRECTORY
app.use(mongoSanitize({
    replaceWith: '_'
}))


const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//FLASH MIDDLEWARE
///these local methods are available on every request/template
app.use((req, res, next) => {
    res.locals.isUser = req.user;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/', (req, res) => {
    res.render('home');
})

//Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);



//hits if any route before this doesn't match
app.all('*', (req, res, next) => {
    console.log('Error!!!');
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    // console.log(err);
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Oh No, Something went wrong!';
    }

    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})