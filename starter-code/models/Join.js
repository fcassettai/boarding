const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const joinSchema = new Schema({
  _event: {
    type: Schema.Types.ObjectId,
    ref: "Game"
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Join = mongoose.model("Join", joinSchema);
module.exports = Join;