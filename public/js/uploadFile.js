// Elements
const $uploadForm = document.querySelector('#assignmentUploadForm');
const $uploadFile = $uploadForm.elements["assignmentFile"];
const $assignmentName = $uploadForm.elements["assignmentName"];

// URL PARSING
const url = new URLSearchParams(location.search);
const studentName = url.get('studentName');
const teacherName = url.get('teacherName');
const assignmentName = url.get('assignmentName');
const groupName = url.get('groupName');

const fileUpload = async function () {
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("data", $uploadFile.files[0]);
    formData.append("assignmentName", assignmentName);
    formData.append("teacherName", teacherName);
    formData.append("studentName", studentName);

    const response = await fetch(`http://localhost:3000/uploadAssignment`, {
        method: 'POST',
        body: formData
    });

    return response.json();
}


$uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    fileUpload().then(function (data) {
        console.log(data);

        if (data.updated) {
            alert('Assignment Updated Successfully...');
        }

        if (data.newAssignment) {
            alert('Assignment Created Successfully...')
        }
    }).catch(function (error) {
        console.log('Error is...');
        console.log(error);
    });
})