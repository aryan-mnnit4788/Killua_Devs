const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    assignmentName: {
        type: String,
        trim: true,
        lowercase: true,
        reiqured: true,
    },
    subjectName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    teacherName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    data: {
        type: Buffer
    },
}, {
    timestamps: true
});

// Static Methods For assignmentSchema
assignmentSchema.statics.findDistinctAssignment = async function (groupName) {
    const map = [];
    const assignments = await this.find({
        subjectName: groupName,
    });

    const result = []
    assignments.forEach(function (data) {
        if (!map.includes(data.assignmentName)) {
            data.data = undefined;
            result.push(data);
            map.push(data.assignmentName);
        }
    });
    return result;
}

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;