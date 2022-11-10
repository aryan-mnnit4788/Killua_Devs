// Elements
const $createGroups = document.querySelector('#createGroups-form');

const createGroup = async function () {
    const data = {
        username: $createGroups.elements["username"].value,
        email: $createGroups.elements["email"].value,
        password: $createGroups.elements["password"].value,
        groupName: $createGroups.elements["groupName"].value,
        groupCode: $createGroups.elements["groupCode"].value
    }

    const response = await fetch(`http://localhost:3000/createGroups`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

$createGroups.addEventListener('submit', function (event) {
    event.preventDefault();

    createGroup().then(function (data) {
        console.log(`Data is.....`);
        console.log(data);
        if (data.code) {
            alert('Group already exists...');
            location.href = `http://localhost:3000/createGroups.html`;
        }
        else{
            alert('Group Create Successfully..');
            location.href = `http://localhost:3000/homeWindow.html`
        }
    }).catch(function (error) {
        console.log(error);
    })
});