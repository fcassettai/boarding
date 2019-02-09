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
  Promise.all([
    Join.find({_user:req.user._id}).lean(),
    Event.find()
    .populate('_game')
    .populate('_user').lean()
  ]).then(([usersEvents, allEvents])=>{
    console.log('user event',usersEvents)
    console.log('all events',allEvents)
    res.render('events',{ 
      allEvents: allEvents.map(event=>({
        ...event,
        isJoined: usersEvents.some(join=>join._user.equals(req.user._id)&&join._event.equals(event._id))
      })),
      errorMessage: req.flash('errorMessage')[0]
    })
  })
  .catch(err=>console.log(err))
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

//GET cancel join
router.get('/cancel-event-join/:eventId',(req,res,next)=>{
  console.log('req.params.eventId', req.params.eventId)
  Join.findOneAndRemove({_event:req.params.eventId,
  _user:req.user._id})
  .then(()=>res.redirect('/events'))
  .catch(err=>console.log(err))

})
module.exports = router;
