// Elements
const $username = document.querySelector('#username');

const getUserData = async function(){
    const respone = await fetch(`http://localhost:3000/userData?authToken=${localStorage.getItem("authToken")}`);
    return respone.json();
}

getUserData().then(function(user){
    console.log(user);
    if (user.error)
    {
        alert('Unauthorised Access...');
        location.href = `http://localhost:3000/index`;
    }
    $username.textContent = user.username
}).catch(function(error){
    console.log('Error is....');
    console.log(error);
});