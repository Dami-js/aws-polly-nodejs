// Load the SDK
const AWS = require("aws-sdk");
const Fs = require("fs");
const express = require("express");
const { create } = require("express-handlebars");
var bodyParser = require("body-parser");
const path = require("path");

const app = express();

const hbs = create({
    extname: ".hbs",
});

const Polly = new AWS.Polly({
    signatureVersion: "v4",
    region: "us-east-1",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", (req, res) => {
    let params = {
        Text: req.body.text,
        OutputFormat: "mp3",
        VoiceId: "Kimberly",
    };

    Polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err.code);
            res.status(400).json({ message: "Ann error occurred" });
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                Fs.writeFile(
                    "./public/speech.mp3",
                    data.AudioStream,
                    function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    }
                );

                res.json({ message: "Done", audio: "/speech.mp3" });
            }
        }
    });
});

app.listen(3000);
