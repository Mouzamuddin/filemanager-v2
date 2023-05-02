const dbConfig = require("./configs/db.config");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const fileListRoutes = require("./routes/list.route");
const fileRoutes = require("./routes/files.route");

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

mongoose.connect(dbConfig.DB_URL);
app.use(express.json());

const db = mongoose.connection;
db.on("error", () => console.log("Can't connect to DB"));
db.once("open", () => {
  console.log("Connected to Mongo DB");
});

app.use("/check", fileRoutes);
app.use("/upload", fileRoutes);
app.use("/download", fileRoutes);
app.use("/delete", fileRoutes);
app.use("/files", fileListRoutes);

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
