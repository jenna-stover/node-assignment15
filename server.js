const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({dest: __dirname + "/public/images"});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let breeds = [
    {
        _id: 1,
        name: "Russian Blue",
        personality: [
            "Sweet", 
            " Loyal", 
            " Shy",
        ],
        appearance: [
            "Short-haired", 
            " light-dark grey coat",
        ],
        origin: "Arkhangelsk, Russia",
        lifespan: "15-20 years",
        img: "images/russian-blue.jpg"
    },
    {
        _id: 2,
        name: "Maine Coon",
        personality: [
            "Extroverted", 
            " Playful", 
            " Affectionate",
        ],
        appearance: [
            "Long-haired", 
            " range of colors", 
            " large in size",
        ],
        origin: "Maine",
        lifespan: "10-13 years",
        img: "images/maine-coon.jpg"
    },
    {
        _id: 3,
        name: "Siamese",
        personality: [
            "Social",
            " Affectionate",
            " Intelligent",
        ],
        appearance: [
            "Short-haired", 
            " cream coat with dark points",
        ],
        origin: "Thailand",
        lifespan: "15-20 years",
        img: "images/siamese.jpg"
    },
    {
        _id: 4,
        name: "Ragdoll",
        personality: [
            "Affectionate", 
            " Gentle",
            " Calm",
        ],
        appearance: [
            "Long-haired",
            " white/cream with dark points",
            " blue eyes",
        ],
        origin: "Riverside, California",
        lifespan: "12-15 years",
        img: "images/ragdoll.jpg"
    },
    {
        _id: 5,
        name: "British Shorthair",
        personality: [
            "Loyal",
            " Loving",
            " Easygoing",
        ],
        appearance: [
            "Short-haired",
            " grey-blue coat",
            " thick fur",
        ],
        origin: "Great Britain",
        lifespan: "12-20 years",
        img: "images/british-shorthair.jpg"
    },
    {
        _id: 6,
        name: "Somali",
        personality: [
            "Affectionate",
            " Lively",
            " Sociable ",
        ],
        appearance: [
            "Long-haired",
            " reddish-brown coat",
            " thick and silky fur",
        ],
        origin: "United States",
        lifespan: "12-14 years",
        img: "images/somali.jpg"
    },
];

app.get("/api/breeds", (req,res) => {
    res.send(breeds);
});

app.get("/api/breeds/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const breed = breeds.find((r) => r._id === id);

    if(!breed) {
        res.status(404).send("The breed with the given id was not found.");
    }
    res.send(breed);
});

app.post("/api/breeds", upload.single("img"), (req, res) => {
    const result = validateBreed(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const breed = {
        _id: breeds.length +1,
        name: req.body.name,
        origin: req.body.origin,
        lifespan: req.body.lifespan,
        personality: req.body.personality.split(","),
        appearance: req.body.appearance.split(","),
    };

    if(req.file) {
        breed.img = "images/" + req.file.filename;
    }

    breeds.push(breed);
    res.send(breed);
});

app.put("/api/breeds/:id", upload.single("img"), (req, res) => {
    console.log("in put");
    const id = parseInt(req.params.id);
    const breed = breeds.find((r) => r._id === id);
    const result = validateBreed(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    breed.name = req.body.name;
    breed.personality = req.body.personality.split(",");
    breed.appearance = req.body.appearance.split(",");
    breed.origin = req.body.origin;
    breed.lifespan = req.body.lifespan;

    if(req.file) {
        breed.img = "images/" + req.file.filename;
    }

    res.send(breed);
});

app.delete("/api/breeds/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const breed = breeds.find((r) => r._id === id);

    if(!breed) {
        res.status(404).send("The breed with the given id was not found.");
    }

    const index = breeds.indexOf(breed);
    breeds.splice(index, 1);
    res.send(breed);
});

const validateBreed = (breed) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        personality: Joi.string().min(3).required(),
        appearance: Joi.string().min(3).required(),
        origin: Joi.allow(""),
        lifespan: Joi.allow(""),
        img: Joi.allow(""),
    });

    return schema.validate(breed);
}

app.listen(3000, () => {
    console.log("listening");
});