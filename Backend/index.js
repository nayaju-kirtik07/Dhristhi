require("dotenv/config");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const { connectToDatabase } = require("./database/coffee-db-connection");

const userRouter = require("./allRoutes/userRouter");
const productRouter = require("./allRoutes/productRouter");
const categoryRouter = require("./allRoutes/categoryRouter");
const cartRouter = require("./allRoutes/cartRouter");
const orderRouter = require("./allRoutes/orderRouter");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Use your routers here
app.use("/", userRouter);
app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/", categoryRouter);
app.use("/", orderRouter);

connectToDatabase(() => {
  console.log("Successfully connected to database");

  // Listen only on localhost for local development
  server.listen(PORT, () => {
    console.log(`Server is running on localhost:3001`);
  });
});
