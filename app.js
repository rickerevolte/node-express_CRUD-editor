const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = 3000;
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/file", (req, res) => {
    returnFileList(res);
});

function handleFileChangeResponse(err, res) {
    if (err) {
        res.status(500).send({ ok: false, errText: err });
    } else {
        returnFileList(res);
    }
}

function returnFileList(res) {
    fs.readdir(path.join(__dirname, "data"), (err, files) => {
        if (err) {
            res.status(500).send({ ok: false, errText: err });
        } else {
            res.send({ ok: true, files: files });
        };
        console.log(files);
    })
}

app.post("/file", (req, res) => {
    console.log(req.body);
    const filename = path.join(__dirname, "data", req.body.newFile);
    const content = req.body.content;
    console.log(`posting ${req.body.newFile} with ${content}`);
    fs.writeFile(filename, content, (err) => {
        // console.log("app.js should now handleFileChangeResponse");
        handleFileChangeResponse(err, res);
    })
});

app.put("/file", (req, res) => {
    const filename = path.join(__dirname, "data", req.body.fileToRename);
    const newFilename = path.join(__dirname, "data", req.body.newFileName);
    fs.rename(filename, newFilename, (err) => {
        handleFileChangeResponse(err, res);
    });
});

app.delete("/file", (req, res) => {
    const filename = path.join(__dirname, "data", req.body.fileToDelete);
    fs.rm(filename, (err) => {
        handleFileChangeResponse(err, res);
    })
});

app.get("/fileContent", (req, res) => {
    const filename = path.join(__dirname, "data", req.query.fileToEdit);
    fs.readFile(filename, (err, data) => {
        res.send({ content: data.toString() });
    });
});

app.put("/fileContent", (req, res) => {
    const filename = path.join(__dirname, "data", req.body.file);
    const content = req.body.content;
    fs.writeFile(filename, content, (err) => {
        res.send({ ok: true })
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});