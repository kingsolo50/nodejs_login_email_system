
//localhost:8080/api/
'use strict';
        require('dotenv').config();

const   router = require('express').Router();

        
// =============================================================================
// BASE API
// =============================================================================
router.get('/', (req, res, next) => {
    
    res.status(200).json({
        msg: 'User login',
        success: true,
        testing: data
    });

})

module.exports = router;