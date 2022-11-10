// Elements
const $joinGroups = document.querySelector('#joinGroups-form');

const joinGroups = async function () {
    const data = {
        email: $joinGroups.elements["email"].value,
        password: $joinGroups.elements["password"].value,
        groupName: $joinGroups.elements["groupName"].value,
        groupCode: $joinGroups.elements["groupCode"].value
    }

    const response = await fetch(`http://localhost:3000/joinGroups`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

$joinGroups.addEventListener('submit', function (event) {
    event.preventDefault();

    joinGroups().then(function (data) {
        console.log(`Data is...`);
        console.log(data);
    }).catch(function (error) {
        console.log(error);
        console.log(error);
    });
})