const dbConfig = require("./configs/db.config");
const cookieSession = require("cookie-session");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();

const uploadRoute = require("./routes/upload.route");
const downloadRouter = require("./routes/download.route");
const fileRoutes = require("./routes/list.route");

app.use(express.json());
app.use("/", downloadRouter);
app.use("/", fileRoutes);

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: "GET,POST,PUT,DELETE",
    //allowedHeaders:"*",
    credentials: true,
  })
);

app.use("/upload", (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE"
  );
  res.setHeader("Allow", "GET, HEAD, PUT, PATCH, POST, DELETE");
  res.setHeader("Content-Type", "multipart/form-data");
  next();
});

mongoose.connect(dbConfig.DB_URL);
app.use(express.json());

const db = mongoose.connection;
db.on("error", () => console.log("Can't connect to DB"));
db.once("open", () => {
  console.log("Connected to Mongo DB");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/check", uploadRoute);
app.use("/upload", uploadRoute);
app.use("/api", downloadRouter);
app.use("/files", fileRoutes);
app.use("/", fileRoutes);

//route not found
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
