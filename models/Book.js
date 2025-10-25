const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: [String],
    default: []
  }
});

// Virtual property for commentcount
bookSchema.virtual('commentcount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are included when converting to JSON
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);