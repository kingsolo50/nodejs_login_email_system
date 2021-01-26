
//* --> localhost:8080/password-reset/
'use strict';


 require('dotenv').config();

//*         
const   router  = require('express').Router(),
        User    = require('../models/localUser'),
        bcrypt  = require('bcryptjs'),
        jwt     = require('jsonwebtoken');


//*PASSWORD RESET

/*
STEPS
1. SEND USER AN EMAIL WITH A JWT 
2. ONCE EMAIL LINK IS CLICKED
    DIRECT USER TO A PAGE WHERE THEY CAN ENTER ENTER THEIR NEW PASSWORD
    GRAB THE NEW STRING SENT FROM THAT PAGE AND SET IT AS THEIR NEW PASSWORD

*/
router.get('/', (req, res) => {
  res.send('Route activate...')
});

router.post('/', (req, res) => {

    const   email = req.body.email, 
            query = User.findOne({"email": email});
            
            query.exec((err, user) => {
                // return console.log(user);
                if(err) throw err;
                if(!user) {
                    res.json({
                        msg: 'No user found'
                    })
                    return false;
                } else {
                    const token = jwt.sign({ user: user }, process.env.SECRET);
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
                          subject: "Hi ✔ Password reset link", // Subject line
                          //* Route where user will be directed to
                          //* And where we will grab their auth token
                          //* And verify it
                          text: "ROUTE/reset-password/" + `${token}`, // plain text body NOT WORKING!!
                          html: `
                            <img src="http://www.blockl93.com/assets/img/logo-trans.png" style="width: 150px;">
                            <hr>
                            <h3> Click link below to reset your password </h3>
                            //* ROUTE CONFIRMATION
                            <a href="http://localhost:8080/password-reset/${token}" target="_blank">
                            <h3>Reset password</h3>
                            </a> 
                            <p>
                            Team Block L93
                            </p>   
                            `
                        });
          
                    }
        
                    main().catch(console.error)
                    
                }
            }); 
});

router.post('/reset/:token', (req, res) => {

    const token = req.params.token;

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            res.json({
                err: err,
                status: 500,
                success: false,
                msg: 'Failed to authenticate token...'
            });
        } else {

            bcrypt.genSalt(10, function(err, salt) {

                if (err) throw err;

                bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                    
                    if (err) throw err;

                    User.findByIdAndUpdate(decoded.user._id, { $set: {password: hash}}, (err) => {
                        
                        if (err) throw err;
                        
                        user.save((err, done)=> {
                            if (err) throw err;
                            res.json({
                                success: true,
                                status: 200,
                                msg: 'Password updated successfully'                                
                            });
                            return done;
                        });
                    });
                });

            });

        }
    });
});

module.exports = router;




