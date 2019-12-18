const registerName = document.getElementById('registerName');
const registerPassword = document.getElementById('registerPassword');
const registerString = document.getElementById('registerString');
let registerButton = document.getElementById('registerButton');
let result = document.getElementById('register-result');

function checkRegister() {
    fetch('http://localhost:3000/users')
        .then(function (response) {
            // Trasform server response to get the laptops
            response.json().then(function (users) {
                checkValidUser(users);
            });
        });
}

function checkValidUser(users) {
    let userName = registerName.value;
    let userPassword = registerPassword.value;
    let userString = registerString.value;

    resetData();

    for (var i = 0; i < users.length; i++) {
        if (users[i].name == userName) {
            let serverMessage = document.createElement('p');
            serverMessage.innerText = 'There is an existing user with the same name. Please enter a different name.';

            let container = document.createElement('div');
            container.appendChild(serverMessage);
            result.appendChild(container);
            return;
        }
    }

    // If we reached this point, it means that the register data is correct.
    let serverMessage = document.createElement('span');
    serverMessage.innerText = 'The new user has been successfully created!'

    let container = document.createElement('div');
    container.appendChild(serverMessage);
    result.appendChild(container);

    //  Append the new user data to the database.
    const postObject = {
        name: userName,
        password: userPassword,
        special: userString
    }

    fetch('http://localhost:3000/users', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    });
}

function resetData() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

registerButton.addEventListener('click', checkRegister);
resetData();
