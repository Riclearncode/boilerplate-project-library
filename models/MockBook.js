// Simple in-memory storage for testing when MongoDB is not available
let books = [];
let nextId = 1;

class MockBookClass {
  constructor(data) {
    this.title = data.title;
    this.comments = data.comments || [];
    this._id = nextId++;
  }
  
  save() {
    // Update existing book or add new one
    const existingIndex = books.findIndex(b => b._id === this._id);
    if (existingIndex !== -1) {
      books[existingIndex] = this;
    } else {
      books.push(this);
    }
    return Promise.resolve(this);
  }
  
  static find(query = {}) {
    const result = books.map(book => ({
      _id: book._id,
      title: book.title,
      comments: book.comments || []
    }));
    
    // Return promise that resolves to array of books
    return Promise.resolve(result);
  }
  
  // Add select method compatibility
  static select(fields) {
    return this.find();
  }
  
  static findById(id) {
    const book = books.find(b => b._id == id);
    if (book) {
      // Return a book instance with save method
      const bookInstance = new MockBookClass({ title: book.title });
      bookInstance._id = book._id;
      bookInstance.comments = book.comments || [];
      return Promise.resolve(bookInstance);
    }
    return Promise.resolve(null);
  }
  
  static findByIdAndDelete(id) {
    const index = books.findIndex(b => b._id == id);
    if (index === -1) return Promise.resolve(null);
    const deleted = books.splice(index, 1)[0];
    return Promise.resolve(deleted);
  }
  
  static deleteMany() {
    books = [];
    return Promise.resolve();
  }
  
  // Direct method to get all books as array
  static async findAll() {
    return books.map(book => ({
      _id: book._id,
      title: book.title,
      comments: book.comments || []
    }));
  }
}

module.exports = MockBookClass;