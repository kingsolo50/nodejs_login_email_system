const   mongoose  = require('mongoose'),        
        crypto    = require('crypto'),
        bcrypt    = require('bcryptjs'),
        salt      = bcrypt.genSaltSync(10),
        Schema    = mongoose.Schema;


const   localUserSchema = new Schema({
        local: {
          email: { type: String, lowercase: true },
          password: String,
          username: String, 
          pin: Number, 
          picture: String,
          firstName: String,
          lastName: String,
          postCode: String,
          contactNumber: String
        },
        admin: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        created: { type: Date, default: Date.now }
}); 

// =====================================================================
// PROFILE AVATAR GENERATOR 
// =====================================================================
localUserSchema.methods.avatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';


    const hash = crypto.createHmac('sha256', process.env.SECRET)
                        .update(this.email)
                        .digest('hex') 

    return 'https://gravatar.com/avatar/' + hash + '?s' + size + '&d=retro';
};

module.exports = mongoose.model('localUser', localUserSchema, 'localUsers'); 



