
//localhost:8080/api/
'use strict';
        require('dotenv').config();

const   router = require('express').Router();

        
// =============================================================================
// BASE API
// =============================================================================
router.get('/', (req, res, next) => {
    
    res.status(200).json({
        msg: 'API base route',
        success: true
    });

})

module.exports = router;