const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function(request, response, next){
    try{
        const token = request.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'SecretKey');
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if (!user)
            throw new Error(`[-] Access Denied...`);
        
        request.user = user;
        request.token = token;
        next();
    }catch(error){
        response.status(401).send(`[-] Access Denied...`);
    }
}

module.exports = auth;