/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
let Book;

// Determine which Book model to use
if (process.env.NODE_ENV === 'test') {
  // Use mock for testing when MongoDB might not be available
  Book = require('../models/MockBook');
  console.log('Using MockBook for testing');
} else {
  try {
    Book = require('../models/Book');
  } catch (error) {
    Book = require('../models/MockBook');
    console.log('Fallback to MockBook');
  }
}

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        // Get books - both mock and real models return promises
        const books = await Book.find({});
        
        // Ensure books is an array
        const booksArray = Array.isArray(books) ? books : [];
        
        const booksWithCommentCount = booksArray.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments ? book.comments.length : 0
        }));
        
        res.json(booksWithCommentCount);
      } catch (error) {
        console.error('Error in GET /api/books:', error);
        res.status(500).json({ error: 'Could not retrieve books' });
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      
      if (!title) {
        return res.send('missing required field title');
      }
      
      try {
        const newBook = new Book({ title: title });
        const savedBook = await newBook.save();
        res.json({
          _id: savedBook._id,
          title: savedBook.title
        });
      } catch (error) {
        console.error('Error in POST /api/books:', error);
        res.status(500).json({ error: 'Could not create book' });
      }
    })
    
    .delete(async function(req, res){
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (error) {
        console.error('Error in DELETE /api/books:', error);
        res.status(500).json({ error: 'Could not delete all books' });
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      
      // Validate ObjectId for real MongoDB only
      if (mongoose.Types && mongoose.Types.ObjectId && mongoose.Types.ObjectId.isValid) {
        if (!mongoose.Types.ObjectId.isValid(bookid) && isNaN(bookid)) {
          return res.send('no book exists');
        }
      }
      
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments || []
        });
      } catch (error) {
        console.error('Error in GET /api/books/:id:', error);
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      // Validate ObjectId for real MongoDB only
      if (mongoose.Types && mongoose.Types.ObjectId && mongoose.Types.ObjectId.isValid) {
        if (!mongoose.Types.ObjectId.isValid(bookid) && isNaN(bookid)) {
          return res.send('no book exists');
        }
      }
      
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        
        if (!book.comments) {
          book.comments = [];
        }
        book.comments.push(comment);
        const updatedBook = await book.save();
        
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments || []
        });
      } catch (error) {
        console.error('Error in POST /api/books/:id:', error);
        res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      
      // Validate ObjectId for real MongoDB only
      if (mongoose.Types && mongoose.Types.ObjectId && mongoose.Types.ObjectId.isValid) {
        if (!mongoose.Types.ObjectId.isValid(bookid) && isNaN(bookid)) {
          return res.send('no book exists');
        }
      }
      
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook) {
          return res.send('no book exists');
        }
        
        res.send('delete successful');
      } catch (error) {
        console.error('Error in DELETE /api/books/:id:', error);
        res.send('no book exists');
      }
    });
  
};
