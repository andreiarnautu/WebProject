const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
let loginButton = document.getElementById('loginButton');
let result = document.getElementById('login-result');

function checkLogin() {
    fetch('http://localhost:3000/users')
        .then(function (response) {
            // Trasform server response to get the laptops
            response.json().then(function (users) {
                checkValidUser(users);
            });
        });
}

function checkValidUser(users) {
    let userName = loginName.value;
    let userPassword = loginPassword.value;

    resetData();

    for (var i = 0; i < users.length; i++) {
        if (users[i].name == userName && users[i].password == userPassword) {
            let serverMessage = document.createElement('p');
            serverMessage.innerText = 'Congratulations! You have successfully logged in!'

            let specialString = document.createElement('p');
            specialString.innerText = 'Your special string is: ' + users[i].special;

            let container = document.createElement('div');
            container.appendChild(serverMessage);
            container.appendChild(specialString);
            result.appendChild(container);

            return;
        }
    }

    // If we reached this point, it means that the login data is incorrect.
    let serverMessage = document.createElement('span');
    serverMessage.innerText = 'The login data is incorrect. Try again.'

    let container = document.createElement('div');
    container.appendChild(serverMessage);
    result.appendChild(container);
}

function resetData() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

loginButton.addEventListener('click', checkLogin);
resetData();
