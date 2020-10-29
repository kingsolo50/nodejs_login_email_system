
//* --> localhost:8080/api/
'use strict';
        require('dotenv').config();

//*         
const   router          = require('express').Router(),
        User            = require('../models/localUser'),
        bcrypt          = require('bcryptjs'),
        salt            = bcrypt.genSaltSync(10),
        hash            = bcrypt.hashSync("B4c0/\/", salt),
        jwt             = require('jsonwebtoken'),
        nodemailer      = require('nodemailer'),
        smtpTransport   = require('nodemailer-smtp-transport');

        
//! GET ALL USERS
router.get("/users", (req, res) => {

  const   query = User.find({});
  
          query.exec((err, users) => {
          if (err) {
              res.status(400).json({
              success: false,
              msg: "Error getting BlockL93 users",
              err: err
              });
          }

          res.json({
                  status: 200,
                  msg: "Total users "+users.length,
                  data: users
              });
          });
  
});


//!DELETE USER
router.delete('/delete/:id', (req, res) => {
  
  const id = req.params.id;

  User.findByIdAndDelete(id, (err, user) => {
    
    if (err) throw err;

    res.status(200).json({
      msg: 'User deleted successfully',
      user: user.email
    });
    
  });

});

module.exports = router;