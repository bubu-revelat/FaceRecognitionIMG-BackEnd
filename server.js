require("dotenv").config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_URL,
        port: 5432,
        ssl:true
    },
});


// Listen for the connection event
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });


//TODO: Remove in production
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("working");
})

app.post('/signin',(req,res) => {signin.handleSignIn(req,res,db,bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, db)});

app.put("/image", (req,res) => {image.handleImage(req,res,db)});

app.post("/imageurl", (req,res) => {image.handleClarifiAPI(req,res)});


app.listen(process.env.port || 3000, () => {
    console.log(`server is running port ${process.env.port}` );
});