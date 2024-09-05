const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  contactmessenger: { type: String, required: true },
  subject: { type: String },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
  assignedTo: { type: String },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);