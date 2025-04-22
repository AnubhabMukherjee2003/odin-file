const express = require("express");
const multer = require("multer");

const setupMiddleware = require("./middleware/mdw");
const authController = require("./controllers/auth");
const fetchController = require("./controllers/fetchDetails");
const createController = require("./controllers/create");

require('dotenv').config();

const app = express();
const upload = multer({
  dest: "tmp/",
  limits: { fileSize: 20 * 1024 * 1024 },
});

setupMiddleware(app);


app.get("/", authController.getIndex);

app.get("/sign-up", authController.getSignUp);
app.post("/sign-up", authController.postSignUp);

app.get("/login", authController.getLogin);
app.post("/login", authController.postLogin);

app.get("/logout", authController.getLogout);

app.get("/dashboard", fetchController.getDashboard);

app.get("/folders/new", createController.getNewFolder)
   .post("/folders/new", createController.postNewFolder);

app.get("/addFile/:id", createController.getAddFile)
   .post("/addFile/:id", upload.single("file"), createController.postAddFile);

app.get("/files/:id", createController.getFile);
app.get("/files/:id/delete", createController.deleteFile);

app.listen(3000, () => console.log("app listening on port 3000!"));