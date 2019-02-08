const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  position: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: Number,
  _game: {
    type: Schema.Types.ObjectId,
    ref: "Game"
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  description: String
  
  // timestamps: {
  //   createdAt: "created_at",
  //   updatedAt: "updated_at"
  // }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;