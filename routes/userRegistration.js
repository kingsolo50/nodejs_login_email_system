
//* --> localhost:8080/api/
'use strict';

const { text } = require('express');

        require('dotenv').config();

//*         
const   router          = require('express').Router(),
        User            = require('../models/localUser'),
        bcrypt          = require('bcryptjs'),
        salt            = bcrypt.genSaltSync(10),
        jwt             = require('jsonwebtoken'),
        nodemailer      = require('nodemailer'),
        smtpTransport   = require('nodemailer-smtp-transport');

        
//* 
router
.get('/', (req, res) => {    
    res.status(200).json({
        msg: 'User registration',
        success: true
    });
})

//
.post('/', (req, res) => {
    //! FORBIDDEN
    const forbiddenNames = [];

    //* HASH PASSWORD
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            let user = new User();

            user.email            = req.body.email;
            user.password         = hash;
            user.username         = req.body.username;
            user.pin              = req.body.pin;
            user.firstName        = req.body.firstName;
            user.lastName         = req.body.lastName;
            user.contactNumber    = req.body.contactNumber;
            user.postCode         = req.body.postCode;
            user.picture          = user.avatar();

            // Check if user exists
            User.findOne({ 'email': req.body.email }).exec(
                (err, existingUser) => {
                    
                    if (err) throw err;

                    if (existingUser) {
                        res.status(400).json({
                            success: false,
                            msg: 'User already exists',
                            user: existingUser.email
                        })
                        return false;
                    }

                    if (req.body.username == forbiddenNames) {
                        res.status(400).json({
                            success: false,
                            msg: 'Forbidden username'
                        })
                        return false;
                    } else {

                    }

                    //* IF ALL CLEAR
                    //* ADD USER TO DATABASE "SAVE USER"
                    user.save((err, user) => {
                        
                        if (err) throw err;
                        
                        const token = jwt.sign({ user: user }, process.env.SECRET);
                        //*SEND USER EMAIL WITH JWT TOKEN CONTAINING THE USERS DETAILS
                        async function main() {

                            //! create reusable transporter object using the default SMTP transport                         
                            //? ETHEREAL DUMMY ACCOUNT
                            //* create email here ==> https://ethereal.email/create
                            
                            // Nodemailer configuration                            
                            const transporter = nodemailer.createTransport({
                                host: 'smtp.ethereal.email',
                                port: 587,
                                auth: {
                                    user: 'wilford84@ethereal.email',
                                    pass: 'eFNnH7YhqQMd31Rudx'
                                }
                            });
                            
                            // send mail with defined transport object
                            let info = await transporter.sendMail({
                              from: '"Block L93" <info@blockl93.com>', // sender address
                              to: `${req.body.email}`, // list of receivers
                              subject: "Hi ✔ Please verify your email", // Subject line
                              //* Route where user will be directed to
                              //* And where we will grab their auth token
                              //* And verify it
                              text: "ROUTE/reset-password/" + `${token}`, // plain text body NOT WORKING!!
                              html: `
                                <img src="http://www.blockl93.com/assets/img/logo-trans.png" style="width: 150px;">
                                <hr>
                                <h3> Confirm you're email by clicking the link below </h3>
                                //* ROUTE CONFIRMATION
                                <a href="http://localhost:8080/confirm/${token}" target="_blank">
                                    <h3>Click here to confirm your email</h3>
                                </a> 
                                <p>
                                Team Block L93
                                </p>   
                                `
                            });
              
                        }
            
                        main().catch(console.error)
                        

                        res.status(200).json({
                            success: true,
                            msg: 'Successfully registered..., verification email sent.',
                            successMsg: 'Please check you\'re email'
                        });

                        console.log(' -->TOKEN ',token)
                        console.log(' -->USER DETAILS ',user)
                        
                    });
            })

        });
    });

});


module.exports = router;