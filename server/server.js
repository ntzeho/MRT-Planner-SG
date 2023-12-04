const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

const mongoose = require("mongoose");

const Db = process.env.ATLAS_URI;
mongoose.connect(Db, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "timings"});

let db = mongoose.connection;
db.on('connected', () => console.log("MongoDB connected: "));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const router = express.Router();
app.use('/api', router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})
router.get('/', (_, res) => res.send('hello world from user service'));
// router.get('/user', getUsers);
// router.post('/user/login', getUser);
// router.post('/user', createUser);


app.listen(port, () => console.log(`Server is running on port: ${port}`));