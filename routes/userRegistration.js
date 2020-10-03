
//* --> localhost:8080/api/
'use strict';
        require('dotenv').config();

//*         
const   router          = require('express').Router(),
        User            = require('../models/localUsers'),
        bcrypt          = require('bcryptjs'),
        salt            = bcrypt.genSaltSync(10),
        hash            = bcrypt.hashSync("B4c0/\/", salt),
        jwt             = require('jsonwebtoken'),
        nodemailer      = require('nodemailer'),
        smtpTransport   =   require('nodemailer-smtp-transport');

        
//* 
router
.get('/', (req, res) => {    
    res.status(200).json({
        msg: 'User registration',
        success: true
    });
})
.post('/', (req, res) => {
    //! FORBIDDEN
    const forbiddenNames = [];

    //* HASH PASSWORD
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            let user = new User();

            user.local.email            = req.body.email;
            user.local.password         = hash;
            user.local.username         = req.body.username;
            user.local.pin              = req.body.pin;
            user.local.firstName        = req.body.firstName;
            user.local.lastName         = req.body.lastName;
            user.local.contactNumber    = req.body.contactNumber;
            user.local.postCode         = req.body.postCode;
            user.local.picture          = user.avatar();

            // Check if user exists
            User.findOne({ 'local.email': req.body.email }).exec(
                (err, existingUser) => {
                    if (err) throw err;
                    if (existingUser) {
                        res.status(400).json({
                            success: false,
                            msg: 'User already exists',
                            user: existingUser.local.email
                        })
                        return false;
                    }
                    if (req.body.username == forbiddenNames) {
                        res.status(400).json({
                            success: false,
                            msg: 'Forbidden username'
                        })
                        return false;
                    }
                    //* IF ALL CLEAR
                    //* ADD USER TO DATABASE "SAVE USER"
                    user.save((err, user) => {
                        if (err) throw err;
                        res.status(200).json({
                            success: true,
                            msg: 'Successfully registered..., verification email sent.',
                            successMsg: 'Please check you\'re email'
                        })
                        
                        //*SEND USER EMAIL WITH JWT TOKEN CONTAINING THE USERS DETAILS
                        const token = jwt.sign({ user: user }, process.env.SECRET);

                        console.log('Token',token)
                        console.log('User',user)
                        
                    });
                }
            )

        });
    });

});


module.exports = router;