import express from "express";
import cors from "cors";
import morgan from "morgan";

import connect from "./database/conn.js";
import ENV from "./config.js";
import router from "./routes/route.js";

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(201).json("Home Get Request");
});
//api routes
app.use("/api", router);

const PORT = 8080;

connect()
  .then(() => {
    try {
      app.listen(PORT, () =>
        console.log(`server connected to http://localhost:${PORT}`)
      );
    } catch (error) {
      console.log("Cannot connect to the database");
    }
  })
  .catch((error) => console.log("Invalid connection"));
