const   mongoose  = require('mongoose'),        
        crypto    = require('crypto'),
        bcrypt    = require('bcryptjs'),
        salt      = bcrypt.genSaltSync(10),
        Schema    = mongoose.Schema;


const   userSocialSchema = new Schema({
        google: {
          id: String,
          image: String,
          firstName: String,
          lastName: String,
          email: String,
          location: String,
          picture: String
        },
        admin: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        pin: { type: Number }, 
        created: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model('socialUser', userSocialSchema, 'socialUsers'); 



