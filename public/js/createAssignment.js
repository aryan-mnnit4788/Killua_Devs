// Elements
const $uploadForm = document.querySelector('#assignmentUploadForm');
const $uploadFile = $uploadForm.elements["assignmentFile"];
const $assignmentName = $uploadForm.elements["assignmentName"];

// URL Parsing
const url = new URLSearchParams(location.search);
const groupName = url.get('groupName');

const userPrivilege = async function () {
    const response = await fetch(`http://localhost:3000/userData?authToken=${localStorage.getItem("authToken")}`);
    return response.json();
}

const fileUpload = async function (user) {
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("data", $uploadFile.files[0]);
    formData.append("assignmentName", $assignmentName.value);
    formData.append("teacherName", user.username);
    formData.append("studentName", user.username);

    const response = await fetch(`http://localhost:3000/uploadAssignment`,
        {
            method: 'POST',
            body: formData
        });

    return response.json();
}

$uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Send a getRequest To VerifyUser Privilege
    userPrivilege().then(function (user) {
        if (user.error || !user.isTeacher || !user.groups.includes(groupName)) {
            alert(`Unauthorised Access...`);
            location.href = `http://localhost:3000/login.html`;
        }
        console.log(user);

        // Upload the File to express
        fileUpload(user).then(function (data) {
            if (data.error) {
                console.log(data);
                alert('Unsupported File Type');
                location.href = `http://localhost:3000/createAssignment?groupName=${groupName}`;
            }
            console.log(data);
            alert('File Uploaded Successfully...')
            location.href = `http://localhost:3000/group.html?groupName=${groupName}`;
        }).catch(function (fileError) {
            console.log(`Error is....`);
            console.log(fileError);
        });

    }).catch(function (error) {
        console.log(error);
    });
});