//  Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const fs = require("fs");
const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

//----------------  Create --------
app.post("/laptops", (req, res) => {
    const laptopList = readJSONFile();
    const newLaptop = req.body;
    newLaptop.id = uuidv1();
    laptopList.push(newLaptop);
    writeJSONFile(laptopList);
    res.json(newLaptop);
});

app.post("/users", (req, res) => {
    const userList = readUsers();
    const newUser = req.body;
    newUser.id = uuidv1();
    userList.push(newUser);
    writeUsers(userList);
    res.json(newUser);
});



//----------------  Read one --------
app.get("/laptops/:id", (req, res) => {
    const laptopList = readJSONFile();
    const id = req.params.id;
    let flag = false;
    let laptop;

    laptopList.forEach(currentLaptop => {
        if (id == currentLaptop.id) {
            flag = true;
            laptop = currentLaptop;
        }
    });

    if (flag) {
        res.json(laptop);
    } else {
        res.status(404).send('Laptop ${id} was not found');
    }
});



//----------------  Read all --------
app.get("/laptops", (req, res) => {
    const laptopList = readJSONFile();
    res.json(laptopList);
});

app.get("/users", (req, res) => {
    const userList = readUsers();
    res.json(userList);
});

//----------------  Update info --------
app.put("/laptops/:id", (req, res) => {
    const laptopList = readJSONFile();
    const id = req.params.id;
    const newLaptop = req.body;

    newLaptop.id = id;
    let flag = false;

    const newLaptopList = laptopList.map((laptop) => {
        if (laptop.id == id) {
            flag = true;
            return newLaptop;
        }
        return laptop;
    });

    writeJSONFile(newLaptopList);

    if (flag == true) {
        res.json(newLaptop);
    } else {
        res.status(404).send('Laptop ${id} was not found');
    }
});

//----------------  Delete --------
app.delete("/laptops/:id", (req, res) => {
    const laptopList = readJSONFile();
    const id = req.params.id;
    const newLaptopList = laptopList.filter((laptop) => laptop.id != id);

    if (laptopList.length !== newLaptopList.length) {
        res.status(200).send('Laptop ${id} was removed');
        writeJSONFile(newLaptopList);
    } else {
        res.status(404).send('Laptop ${id} was not found');
    }
});


//  Function to parse the db.json file
function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["laptops"];
}

function readUsers() {
    return JSON.parse(fs.readFileSync("login.json"))["users"];
}


//  Function to write text in the db.json file
function writeJSONFile(content) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({laptops: content}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

function writeUsers(content) {
    fs.writeFileSync(
        "login.json",
        JSON.stringify({users: content}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}


//  Start the server
app.listen("3000", () =>
    console.log("Server started at: http://localhost:3000")
);
