const list = document.getElementById('image-list');
const formName = document.getElementById('formName');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');
let slideshowButton = document.getElementById('slideshowButton');
let slides = document.getElementById('slideshow');
let stopButton = document.getElementById('stopButton');

// Fetch the laptop list
function getLaptops() {
    fetch('http://localhost:3000/laptops')
        .then(function (response) {
            // Trasform server response to get the laptops
            response.json().then(function (laptops) {
                appendLaptopsToDOM(laptops);
            });
        });
};

function postLaptop() {
    //  Create a new post object.
    const postObject = {
        name: formName.value,
        img: formUrl.value
    }

    fetch('http://localhost:3000/laptops', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        // Get the new laptop list
        getLaptops();
        resetForm();
    });
}

function deleteLaptop(id) {
    // delete laptop
    fetch(`http://localhost:3000/laptops/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getLaptops();
    });
}

function updateLaptop(id) {
    //  Create a new put object.
    const putObject = {
        name: formName.value,
        img: formUrl.value
    }

    fetch(`http://localhost:3000/laptops/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getLaptops();
        addButton.disabled = false;
        clearUpdateButtonEvents();
        resetForm();
    });
}

function editLaptop(laptop) {
    //  Copy laptop information to form.
    formName.value = laptop.name;
    formUrl.value = laptop.img;
    // disable add button
    addButton.disabled = true;

    clearUpdateButtonEvents();

    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateLaptop(laptop.id)
    });
}

function appendLaptopsToDOM(laptops) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // create and append tags
    for (let i = 0; i < laptops.length; i++) {
        //  Create new image&name objects.
        let img = document.createElement('img');
        console.log(laptops[i].img);
        img.src = laptops[i].img;
        img.className = "services-image";
        let name = document.createElement('span');
        name.innerText = laptops[i].name;
        name.className = "services-span";

        //  Create edit&delete buttons.
        let editButton = document.createElement('button');
        editButton.addEventListener('click', function () {
            editLaptop(laptops[i])
        });
        editButton.innerText = 'Edit';
        editButton.className = 'script-btn';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteLaptop(laptops[i].id)
        });
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'script-btn';
        //  Create a container for the new nodes.
        let container = document.createElement('div');
        container.appendChild(img);
        container.appendChild(name);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        list.appendChild(container);
    }
}

function resetForm() {
    formName.value = '';
    formUrl.value = '';
}

function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}

var laptopList;
var slideTimer;
function generateSlideshow() {
    fetch('http://localhost:3000/laptops')
        .then(function (response) {
            // Trasform server response to get the laptops
            response.json().then(function (laptops) {
                laptopList = laptops;
                slideTimer = window.setInterval(showSlides, delayMs);
            });
        });
}

var slideIndex = 0;
var delayMs = 2000;
function showSlides() {
    //  Delete the former slide
    while (slides.firstChild) {
        slides.removeChild(slides.firstChild);
    }

    // console.log(laptopList.length);
    // console.log(slideIndex);
    // console.log("****");

    //  Show the current slide
    let image = document.createElement('img');
    image.src = laptopList[slideIndex].img;
    image.className = "services-image";

    slideIndex++;
    if (slideIndex >= laptopList.length) {
        slideIndex = 0;
    }

    slides.appendChild(image);
}

function stopSlides() {
    window.clearInterval(slideTimer);
    while (slides.firstChild) {
        slides.removeChild(slides.firstChild);
    }
}

addButton.addEventListener('click', postLaptop);
slideshowButton.addEventListener('click', generateSlideshow);
stopButton.addEventListener('click', stopSlides);

getLaptops();
