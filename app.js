const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

const MongoStore = require('connect-mongo')(session);
const config = require('./config');

//EXPRESS
const app = express();

mongoose.connect(config.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).catch(error => console.error(error));
mongoose.connection
    .on('error', (error) => console.error(error))
    .on('close', () => console.warn('Database disconnected...'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to Host:${info.host}:${info.port}/${info.name}`
        );
        // require("./mocks")(10, id);
    });
mongoose.Promise = global.Promise;


// sessions
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    })
);

//status and uses
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cors('*'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/staylesheets', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use(
    '/javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

//routes
app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/post', require('./routes/post'));
app.use('/users', require('./routes/user'));
app.use('/comment', require('./routes/comment'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {},
    });
});

app.listen(config.PORT, err => err ? console.error(err) : console.log(`Server started on port ${config.PORT}!`));