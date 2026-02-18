require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors);
app.use(express.json());

app.listen(process.env.PORT || 8080, ()=>
  console.log(`Server running on port ${process.env.PORT || 8080}`));