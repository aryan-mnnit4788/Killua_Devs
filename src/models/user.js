const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    isTeacher: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: function(value){
            if (!validator.isEmail(value))
                throw new Error(`[-] Invalid Email Address...`);
        }
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    groups: [{
        type: String
    }]
}, {
    timestamps: true
});

// Document Methods
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()}, 'SecretKey');
    user.tokens = user.tokens.concat({token});
    await user.save();
    // console.log(token);
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

// Static Methods
userSchema.statics.findByCredentials = async function(email, password){
    const user = await this.findOne({email});
    if (!user)
        throw new Error(`[-] Unable to Login...`);
    
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch)
        throw new Error(`[-] Unable to Login...`);
    
    return user;
}

// MIDDLEWARE TO HASH USER PASSWORD
userSchema.pre('save', async function(next){
    const user = this;
    
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;