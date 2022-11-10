const url = new URLSearchParams(location.search);
const groupName = url.get('groupName');

let assignmentName = undefined;
let teacherName = undefined;

// Elements
const $main = document.querySelector('#main');
const $navbar = document.querySelector('.navbar');

// Template
const assignmentTemplate = document.querySelector('.assignment-template').content;

const getAssignments = async function () {
    const response = await fetch(`http://localhost:3000/fetchAssignment?groupName=${groupName}&authToken=${localStorage.getItem("authToken")}`);
    return response.json();
}

const renderAssignments = async function (assignments, isTeacher, username) {
    let template = undefined;
    assignments.forEach(function (assignment) {
        template = document.importNode(assignmentTemplate, true);
        template.querySelector('.assignmentName').textContent = assignment.assignmentName;
        template.querySelector('.createdAt').textContent = assignment.createdAt;
        template.querySelector('.createdBy').textContent = `Created By: ${assignment.teacherName}`;
        // THIS IS A CHANGE -----------------
        if (isTeacher) {
            template.querySelector('.upload-assignment').style.display = 'none';
        }
        else {
            template.querySelector('.upload-assignment').href = `/uploadAssignment.html?studentName=${username}&teacherName=${assignment.teacherName}&assignmentName=${assignment.assignmentName}&groupName=${groupName}`;
        }
        //-----------------
        $main.appendChild(template);
    });
}

const activateViewButton = function () {
    $main.addEventListener('click', function (event) {
        if (event.target.classList.contains('assignmentLink')) {
            for (let i = 0; i < event.target.parentElement.childNodes.length; i++) {
                if (!event.target.parentElement.childNodes[i].classList)
                    continue;
                else if (event.target.parentElement.childNodes[i].classList.contains('assignmentName')) {
                    assignmentName = event.target.parentElement.childNodes[i].textContent;
                }
                else if (event.target.parentElement.childNodes[i].classList.contains('createdBy')) {
                    teacherName = event.target.parentElement.childNodes[i].textContent;
                    teacherName = teacherName.replace("Created By: ", "");
                }
            }
        }
        location.href = `http://localhost:3000/viewAssignmentFile?assignmentName=${assignmentName}&studentName=${teacherName}&teacherName=${teacherName}&groupName=${groupName}`;
    });
}

getAssignments().then(function (data) {
    console.log(data);
    if (data.error) {
        alert('Unauthorised Access...');
        location.href = `http://localhost:3000/homeWindow.html`;
    }

    if (data.user.isTeacher) {
        // Create a new Anchor Tag
        const createAssignmentLink = document.createElement('a');
        createAssignmentLink.style.transform = "translate(41vw, 0vh)";
        createAssignmentLink.style.color = 'black';
        createAssignmentLink.setAttribute('href', `http://localhost:3000/createAssignment.html?groupName=${groupName}`);
        createAssignmentLink.innerHTML = 'Create Assignment';
        $navbar.insertAdjacentElement('afterbegin', createAssignmentLink);
    }

    // THIS IS A CHANGE-----------------
    // Activate the View Assignment Button
    renderAssignments(data.assignments, data.user.isTeacher, data.user.username);
    activateViewButton(); // -----------------
}).catch(function (error) {
    console.log(error);
    if (error)
        location.href = `http://localhost:3000/signup`; // If error from authMiddleWare i.e user not authenticated then redirect to signup
});