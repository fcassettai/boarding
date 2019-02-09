const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const Event = require("../models/Event");
const Join = require("../models/Join");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET add-event page
router.get("/add-event", (req, res, next) => {
  if (!req.user) {
    req.flash("errorMessage", "You need to be connected to add a link");
    res.redirect("/login");
    return;
  }
  
  Game.find().then(games => {
    res.render("add-event", { games });
  });
});

//POST add-event
router.post("/add-event", (req, res, next) => {
  const { position, date, _game, description, slot } = req.body;
  const _user = req.user._id;

  const newEvent = new Event({
    position,
    date,
    _game,
    description,
    slot,
    _user
  });

  newEvent
    .save()
    .then(event => {
      res.redirect("/events");
    })
    .catch(err => console.log(err));
});

//GET events  //find all the events
router.get('/events',(req,res,next)=>{
  Event.find()
  .populate('_game')
  .populate('_user')
  .then(events=>{
    res.render('events',{events})
  })
})

//GET join 
router.get('/join-event/:eventId',(req,res,next)=>{
  const _event = req.params.eventId
  const _user  = req.user._id
  
  const newJoin = new Join({
   _event,
   _user
  })

  newJoin.save()
   .then(()=>{
     res.redirect('/events')
   })
   .catch(err=>console.log(err))


})
module.exports = router;
