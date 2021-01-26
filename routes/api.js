
//localhost:8080/api/
'use strict';
        require('dotenv').config();

const   router  = require('express').Router(),
        path    = require('path');

        
// =============================================================================
// BASE API
// =============================================================================
router.get('/', (req, res, next) => {

    res.sendFile(path.join(__dirname+'/routes.html'));

})

module.exports = router;