const $signupForm = document.querySelector("#signup-form");

const saveUser = async function () {
    const data = {
        username: $signupForm.elements["username"].value,
        email: $signupForm.elements["email"].value,
        isTeacher: $signupForm.elements["isTeacher"].value,
        password: $signupForm.elements["password"].value,
    };

    const respone = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return respone.json();
};

$signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveUser().then(function (data) {
        console.log(data);
        localStorage.setItem("authToken", data.token);
        const url = `http://localhost:3000/welcome.html`;
        location.href = url;
    }).catch(function (error) {
        console.log(error);
    });
});

// localStorage.clear()
// localStorage.setItem("key", "value");
// localStorage.removeItem("key");
// localStorage.getItem("key");