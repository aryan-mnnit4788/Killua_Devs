const express = require('express');
const User = require('../models/user');
const Groups = require('../models/groups');
const Assignment = require('../models/assignment');
const router = new express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// MainPage
router.get('', function (request, response) {
    response.render('index');
})

// SignUp Page
router.get('/signup', function (request, response) {
    response.render('signup');
});

// SignUp Endpoint
router.post('/users', async function (request, response) {
    const user = new User(request.body);

    try {
        const token = await user.generateAuthToken();
        response.status(201).send({ user, token });
    } catch (error) {
        response.status(400).send();
    }
});

// Login
router.post('/users/login', async function (request, response) {
    try {
        const user = await User.findByCredentials(request.body.email, request.body.password);

        if (!user)
            return response.status(400).send({
                error: 'Unauthorised Access'
            });

        const token = await user.generateAuthToken();
        response.send({ user, token });
    } catch (error) {
        console.log(error);
        response.status(400).send({
            error: 'Unauthorised Access...'
        });
    }
});

// Logout Of device
router.post('/users/logout', async function (request, response) {
    try {
        const user = await User.findOne({
            'tokens.token': request.body.authToken
        });
        if (!user)
            return response.status(400).send({
                error: 'Unauthorised Access...'
            });

        user.tokens = user.tokens.filter(function (token) {
            return token.token !== request.body.authToken;
        });

        await user.save();
        response.send({
            message: 'Logout SuccessFull...'
        });
    } catch (error) {
        response.send({
            error
        });
    }
});

// Logout of All device
router.post('/users/logoutAll', async function (request, response) {
    try {
        const user = await User.findOne({
            'tokens.token': request.body.authToken
        });
        if (!user)
            return response.status(400).send({
                error: 'Unauthorised Access...'
            });

        user.tokens = [];
        await user.save();
        response.send({
            message: 'LoggedOut of All devices...'
        });
    } catch (error) {
        response.send({
            error: 'An error has occured...'
        });
    }
})

// FetchUserInfo Endpoint
router.get('/userData', async function (request, response) {
    const user = await User.findOne({ 'tokens.token': request.query.authToken });
    // user.groups = user.groups.concat("Science");
    // await user.save();
    if (!user) {
        return response.status(404).send({
            error: "User Not Found"
        });
    }
    response.send(user);
});

// CreateGroups Endpoint
router.post('/createGroups', async function (request, response) {
    // Check For duplicate Groups Left...
    const newGroup = new Groups({
        groupName: request.body.groupName.toLowerCase().trim(),
        groupCode: request.body.groupCode.trim()
    });

    try {
        const group = await newGroup.save();
        const user = await User.findByCredentials(request.body.email, request.body.password);
        user.groups = user.groups.concat(group.groupName.toString());
        await user.save();
        response.send(user);
    } catch (error) {
        console.log(error);
        response.send(error);
    }
});

// JoinGroups Endpoint
router.post('/joinGroups', async function (request, response) {
    try {
        const group = await Groups.findOne({
            groupCode: request.body.groupCode
        });

        if (!group)
            return response.status(404).send({
                error: "Invalid Group"
            });

        const user = await User.findByCredentials(request.body.email, request.body.password);
        if (!user)
            return response.status(400).send({
                error: "Please Check Your Credentials..."
            });

        const exists = user.groups.find((group) => group === request.body.groupName.toLowerCase());
        if (exists)
            return response.status(400).send({
                error: "Already part of this group...."
            });

        user.groups = user.groups.concat(request.body.groupName);
        await user.save();
        response.status(200).send(user);
    } catch (error) {
        response.send(error);
    }
});

// Endpoint for fetching Assignments
router.get('/fetchAssignment', async function (request, response) {
    try {
        // Check if user is part of the given Group
        const authToken = request.query.authToken;
        const user = await User.findOne({
            'tokens.token': authToken,
            'groups': request.query.groupName.toLowerCase()
        });
        if (user.length === 0)
            return response.status(400).send({
                error: "Unauthorised Access..."
            });

        // Fetching all the assignments of the given Group
        const assignments = await Assignment.findDistinctAssignment(request.query.groupName.toLowerCase());
        // console.log(`GroupName is ${request.query.groupName.toLowerCase()}`);
        response.send({
            assignments,
            user
        });
    } catch (error) {
        response.send(error);
    }
});

// Upload Endpoint
const upload = multer({
    limits: {
        fileSize: 25000000
    },
    fileFilter: function (request, file, cb) {
        console.log(file.originalname);
        if (!file.originalname.match(/\.(pdf|docx|doc|rtf|txt)$/))
            cb(new Error(`Unsupported File....`));
        cb(undefined, true);
    }
});

router.post('/uploadAssignment', upload.single('data'), async function (request, response) {
    // Check if the same assignment exists for the same user then update the existing assignment
    const assignment = await Assignment.findOne({
        studentName: request.body.studentName,
        teacherName: request.body.teacherName,
        subjectName: request.body.groupName,
        assignmentName: request.body.assignmentName,
    });

    if (assignment) {
        assignment.data = request.file.buffer;
        await assignment.save();
        return response.send({
            updated: "Assignment updated successfully..."
        });
    }
    // Create a newEntry for the newAssignment
    const newAssignment = new Assignment({
        studentName: request.body.studentName,
        assignmentName: request.body.assignmentName,
        subjectName: request.body.groupName,
        teacherName: request.body.teacherName,
        data: request.file.buffer
    });

    await newAssignment.save();
    response.send({
        newAssignment: 'Assignment Submitted Successfully'
    });

}, function (error, request, response, next) {
    response.status(400).send({
        error: "Unsuppported File Type..."
    });
});

// Endpoint to viewAssignment
router.get('/viewAssignmentFile', async function (request, response) {
    try {
        const assignment = await Assignment.findOne({
            assignmentName: request.query.assignmentName,
            studentName: request.query.studentName,
            teacherName: request.query.teacherName,
            subjectName: request.query.groupName,
        });

        // This is a change
        // Checking if Upload Button got activated due to click on main
        if (!assignment)
            return response.send({
                data: 'Currently You have not Submitted this Assignment😢😢😢'
            });
        // ---------------------
        response.set('Content-Type', `application/pdf`);
        response.send(assignment.data);
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;