const path = require("path");
const cors = require("cors");
const express = require("express");
const {Buffer} = require("buffer");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
app.use(compression());
app.use(helmet());
app.use(cors());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
let encrypted = "";
let decrypted = "";
const port = process.env.PORT || 3100;


app.get("/", (req, res) => {
    res.status(200).redirect("/new-message")
});

app.get("/new-message", (req, res) => {
    res.status(200).render("new-message", {
        title: "Enter a secret message"
    })
});

app.use("/message", (req, res, next) => {  
    encrypted = Buffer.from(req.body.message).toString("base64");
    decrypted = Buffer.from(encrypted, 'base64').toString();
    next();
});



app.post("/message", (req, res) => {
    res.status(201).render("message", {
        title: "Message created!",
        encrypted: encrypted,
        decrypted: decrypted,
        url: `http://${req.hostname}:${port}/${encrypted}`
    });
});


app.use(`/${encrypted}`, (req, res) => {
    res.render("decrypted", {
        title: "Your secret message",
        encrypted: encrypted,
        decrypted: decrypted,
    })
})

app.listen(port, () => {console.log("listening...")})