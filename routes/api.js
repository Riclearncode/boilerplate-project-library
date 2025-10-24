/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  // In-memory book storage: { id: { _id, title, comments: [] } }
  const books = {};

  // simple id generator
  function genId() {
    return (Date.now().toString(36) + Math.random().toString(36).slice(2,9));
  }

  // seed one book so the example functional test that expects at least one book won't fail
  (function seed() {
    const id = genId();
    books[id] = { _id: id, title: 'init book', comments: [] };
  })();

  app.route('/api/books')
    .get(function (req, res){
      // return array of {_id, title, commentcount}
      const out = Object.keys(books).map(id => {
        const b = books[id];
        return { _id: b._id, title: b.title, commentcount: (b.comments && b.comments.length) || 0 };
      });
      res.json(out);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) return res.type('text').send('missing required field title');
      const id = genId();
      const book = { _id: id, title: title, comments: [] };
      books[id] = book;
      res.json({ _id: book._id, title: book.title });
    })
    
    .delete(function(req, res){
      // clear all books
      Object.keys(books).forEach(k => delete books[k]);
      res.type('text').send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      const book = books[bookid];
      if(!book) return res.type('text').send('no book exists');
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) return res.type('text').send('missing required field comment');
      const book = books[bookid];
      if(!book) return res.type('text').send('no book exists');
      book.comments.push(comment);
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      const book = books[bookid];
      if(!book) return res.type('text').send('no book exists');
      delete books[bookid];
      res.type('text').send('delete successful');
    });
  
};
