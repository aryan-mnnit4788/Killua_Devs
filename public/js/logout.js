// Elements
const $logout = document.querySelector('#logout');
const $logoutAll = document.querySelector('#logoutAll');


const logoutUser = async function () {
    const data = {
        authToken: localStorage.getItem("authToken")
    }
    const response = await fetch(`http://localhost:3000/users/logout`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

const logoutAll = async function () {
    const data = {
        authToken: localStorage.getItem("authToken")
    }
    const response = await fetch(`http://localhost:3000/users/logoutAll`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

$logout.addEventListener('click', function (request, response) {
    // alert('Begin');
    logoutUser().then(function (data) {
        if (data.error) {
            alert('Unauthorised Access...');
            location.href = `http://localhost:3000`;
        }
        else {

            localStorage.clear();
            console.log(localStorage);
            alert('Logged Out Successfully...');
            location.href = `http://localhost:3000`;
        }
    }).catch(function (error) {
        alert('An error has occurred...');
    })
});

$logoutAll.addEventListener('click', function (event) {
    logoutAll().then(function (data) {
        if (data.error) {
            alert('Unauthorised Access...');
            location.href = `http://localhost:3000`;
        }
        else {
            alert('LoggedOut Of all Active Sessions...');
            localStorage.clear();
            location.href = `http://localhost:3000`;
        }
    })
});