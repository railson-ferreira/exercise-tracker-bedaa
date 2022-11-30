const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname.replace("api","")+ '/views/index.html')
});


let count = 0;
let users = {

}
app.post('/api/users', (req, res) => {
  count = ++count;
  const id = count;
  users[id] = {
    _id: id,
    ...req.body
  }
  res.json(users[id])
});


app.get('/api/users', (req, res) => {
  res.json([{
    _id: "singleton",
    username: "fcc_test_16697709168"
  }])
});


let exercisesPerUserId = {}

app.post('/api/users/:userId/exercises', (req, res) => {
  const exercise = req.body;
  if(exercisesPerUserId[req.params.userId]){
    exercisesPerUserId[req.params.userId] = [...exercisesPerUserId[req.params.userId],exercise]
  }else{
    exercisesPerUserId[req.params.userId] = [exercise];
  }

  exercise.duration = Number(exercise.duration);
  if(exercise.date){
    exercise.date = new Date(exercise.date).toDateString();
  }else{
    exercise.date = new Date().toDateString();
  }

  const responseObj =  {
    ...users[req.params.userId],
    ...exercise,
  }

  res.json(responseObj)
});


app.get('/api/users/:userId/logs', (req, res) => {
  const userId = req.params.userId;
  const {from,to,limit} = req.query;

  let log = exercisesPerUserId[userId];

  if(from&&to){
    const dateFrom = new Date(from);
    const dateTo = new Date(to);
    log = log.filter(item=>{
      const date = new Date(item.date);
      return date>=dateFrom && date<=dateTo
    })
  }
  if(limit){
    if(log.length>limit){
      log = log.slice(0,limit)
    }
  }

  const exercise = req.body;
  exercise.duration = Number(exercise.duration);
  if(exercise.date){
    exercise.date = new Date(exercise.date).toDateString();
  }

  const responseObj =  {
    ...users[userId],
    count: log.length,
    log,
  }
  console.log(responseObj);
  console.log(log);

  res.json(responseObj)
});



module.exports = app;