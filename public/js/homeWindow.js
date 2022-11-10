//  Templates
const userInfoTemplate = document.querySelector('#userInfo-template').content;
const groupTemplate = document.querySelector('.groups-template').content;

// Element
const $main = document.querySelector('#main');

const renderUserInfo = function (user) {
    let template = document.importNode(userInfoTemplate, true);
    template.querySelector('#username').textContent = user.username;
    template.querySelector('#isTeacher').textContent = user.isTeacher;
    $main.appendChild(template);
}

const renderGroups = function (groups) {
    for (let i = 0; i < groups.length; i++) {
        let template = document.importNode(groupTemplate, true);
        template.querySelector('#groupName').textContent = groups[i];
        $main.appendChild(template);
    }
}

const getUserData = async function (authToken) {
    const response = await fetch(`http://localhost:3000/userData?authToken=${authToken}`);
    const user = await response.json();

    if (user.error)
        location.href = `http://localhost:3000/signup`;
    renderUserInfo(user);
    console.log(user);
    renderGroups(user.groups);

    if (user.isTeacher === true) {
        document.querySelector('.navbar').insertAdjacentHTML('afterbegin', '<a href="/createGroups.html" target="_blank" class="group-link">Create Groups</a>');
    }
    else {
        document.querySelector('.navbar').insertAdjacentHTML('afterbegin', '<a href="/joinGroups.html" target="_blank" class="group-link">Join Groups</a>');
    }
}

$main.addEventListener('click', function (event) {
    const groupName = event.target.textContent;
    event.target.parentElement.setAttribute('href', `/group.html?groupName=${groupName}`);
    console.log(event.target.parentElement);
});

getUserData(localStorage.getItem("authToken"));