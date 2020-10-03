'use strict'; 
require('dotenv').config();

        // NODE PACKAGES
const   express = require("express"),
        mongoose = require("mongoose"),
        path = require("path"),
        cors = require("cors"),
        morgan = require("morgan"),
        port = process.env.PORT,
        helmet = require("helmet"),
        
//ROUTES
        api                 = require("./routes/api"),
        userLogin           = require("./routes/userLogin"), 
        userRegistration    = require("./routes/userRegistration"),        
        
// APP INIT 
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cors());
        app.use(helmet());
        app.use(morgan('dev')); 
        
const   mongoOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            autoIndex: false, // Don't build indexes
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };

        //DB CONNECTION
        mongoose.connect(process.env.ATLAS, mongoOptions);
 
const   db = mongoose.connection;         
        db.on('error', console.error.bind(console, 'Connection error'));
        db.once('open', function () { console.log('Connected to database')});

        //API ROUTES 
        app.use('/api', api);       
        app.use('/userL', userLogin);
        app.use('/userR', userRegistration); 
        
        //HEROKU SETUP
        if (port == null || port == "") {
            // FRONTEND SOURCE FILES UN-COMMENT BEFORE DEPLOYMENT 
            app.use(express.static(path.join(__dirname, 'public'))); // Home route to render angular build 
            app.get('/', (req, res, next) => {
                res.send('Invalid endpoint, serve.js error')        
            });
            //FINAL ROUTE TO BE HIT BY APP
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, 'public/index.html'));
            });            
        }

        // 404 ERROR HANDLER
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        //HEROKU SETUP
        if (port == null || port == "") {
            port = 8000;
        }
        
        //LISTEN
        app.listen(port, (err) => {
            if (err) {
                console.log('Error starting server')
                return
            }
            console.log(`App running on port ${process.env.PORT}`)
        });         