const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        unique: true
    },
    groupCode: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

const Groups = mongoose.model('Groups', groupSchema);
module.exports = Groups;