// Elements
const $loginForm = document.querySelector('#login-form')

const userLogin = async function () {
    const data = {
        email: $loginForm.elements["email"].value,
        password: $loginForm.elements["password"].value
    }

    const response = await fetch(`http://localhost:3000/users/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

$loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!localStorage.getItem("authToken")) {
        userLogin().then(function (user) {
            if (user.error) {
                alert('Unauthorised Access');
                localStorage.clear();
                location.href = `http://localhost:3000/signup`;
            }// THIS IS A CHANGE---------------------
            else {
                localStorage.setItem("authToken", user.token);
                location.href = `http://localhost:3000/welcome.html`;
            }
        }).catch(function (error) {
            alert('Internal Server Error...');
            location.href = `http://localhost:3000/login.html`;
        });
    }
    else {
        alert('User is already logged in...');
    }
})