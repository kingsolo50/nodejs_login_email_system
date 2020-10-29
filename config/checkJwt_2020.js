// https: //www.npmjs.com/package/jsonwebtoken
'use strict';

const jwt = require('jsonwebtoken');

//.env
require('dotenv').config();
 
module.exports = function (req, res, next) {

  const token = req.params.token;

  if (token) {

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if (err) {
            res.status(400).json({
                err: err,
                success: false,
                msg: 'Failed to authenticate token check-jwt.js ' + token
            });

        } else {
            
            req.decoded = decoded;
            next();
            
        }
    });

} else {
    
    res.json({
        success: false,
        status: 403,
        msg: 'No token provided check-jwt.js'
    });
    
}
          
}