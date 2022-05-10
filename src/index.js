const express = require('express');
const path = require('path');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();
// const csurf = require('csurf');

// initialization
const app = express();
const clientDB = require('./database');

// settings
const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || '*',
    methods: ['GET', 'POST']
};
app.use(cors());

app.use('trust proxy', 1);
app.use(
    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: true,
        name: 'session-user',
        store: MongoStore.create({
            clientPromise: clientDB,
            dbName: process.env.DBNAME
        }),
        cookie: {
            secure: process.env.MODO === 'production', 
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    })
);
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, {id: user._id, user: user.user});
});

passport.deserializeUser(async(user, done) => {
    const userDB = await User.findById(user.id);
    return done(null, {id: userDB.id, user: userDB.user})
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
// app.use(csurf());
// app.use((req, res, next)=>{
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

// routes
app.use(require('./routes/routes'));
app.use('/users', require('./routes/users'));

// server
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`Server in port: ${port}`);
});