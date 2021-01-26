
//* --> localhost:8080/confirm/
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
          status: 500,
          success: false,
          msg: 'Failed to authenticate token...'
      });

    } else {

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

});

module.exports = router;        