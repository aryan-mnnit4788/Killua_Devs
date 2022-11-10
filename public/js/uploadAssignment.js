const url = new URLSearchParams(location.search);
const studentName = url.get('studentName');
const teacherName = url.get('teacherName');
const assignmentName = url.get('assignmentName');
const groupName = url.get('groupName');

// Elements
const $uploadFile = document.querySelector('#uploadAssignment');
const $viewPrevAssignment = document.querySelector('#viewAssignment');

// SettingUp href attribute
$uploadFile.href = `http://localhost:3000/uploadFile.html?studentName=${studentName}&teacherName=${teacherName}&assignmentName=${assignmentName}&groupName=${groupName}`;


$viewPrevAssignment.addEventListener('click', function (event) {
    location.href = `http://localhost:3000/viewAssignmentFile?assignmentName=${assignmentName}&studentName=${studentName}&teacherName=${teacherName}&groupName=${groupName}`;
});