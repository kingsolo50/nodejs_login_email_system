
//* --> localhost:8080/api/
'use strict';


 require('dotenv').config();

//*         
const   router  = require('express').Router(),
        User    = require('../models/localUser'),
        jwt     = require('jsonwebtoken');

router
.get('/', (req, res) => {
  res.send('Route activate...')
})
.post('/:token', (req, res, next) => {

  const token = req.params.token;

  // verify a token symmetric
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    
    if (err) {

      res.json({
          err: err,
          status: 400,
          success: false,
          msg: 'Failed to authenticate token check-jwt.js ' + token
      });

    } else {
      // console.log('User ID', decoded.user._id)
      // console.log('User email', decoded.user.email)

      const query = User.findByIdAndUpdate(decoded.user._id, { $set: {emailVerified: 'true'}});

            query.exec((err,user)=>{
              if (err) throw err;
              if (user.emailVerified == true) {
                res.json({
                  msg: 'Your email is verified'
                });
                return true;
              }
              res.json({
                msg: 'Email confirmed',
                status: 200,
                success: true,
                userEmailVerified: user.email
              });
            });
        
    }
    

  });

  // User.findByIdAndUpdate( id, { $set: { emailVerified: 'true' } }, (err, user) => {
  //   if (err) throw err;
  //   res.json({
  //     msg: 'Email verified successfully',
  //     success: true,
  //     user: user
  //   });
  // });

  //set email verification field to true

});

module.exports = router;        