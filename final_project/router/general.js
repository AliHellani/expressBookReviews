const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBookreviews(isbn) {
  return new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book && Object.keys(book.reviews).length > 0) {
      resolve(book.reviews);
    } else {
      reject(new Error("No reviews found for this book."));
    }
  });
}

/*
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});
*/
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password must be provided"});
  }
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({message: "Username already exists"});
  }

  // If username doesn't exist, add new user
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});


/*
app.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});
*/

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    response.send(JSON.stringify(books,null,4));
  } catch (error) {
    console.error('Error:', error);
  }
}

getBooks();

  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
 public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).send('No book details found based on ISBN');
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if(books[author]){
    res.send(books[author]);
  }else{
    res.status(404).send("No book details found based on Author")
  }
});

// Get all books based on title

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if(books[title]){
    res.send(books[title]);
  }else{
    res.status(404).send("No book details found based on Title")
  }
});

/*
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }
  if(booksByTitle.length > 0){
    res.send(booksByTitle);
  }else{
    res.status(404).send("No book details found based on Title")
  }
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookreviews(isbn).then(function(reviews){
    res.json(reviews);
  }).catch(function(err){
    res.status(404).send("No Book Review");
  });

  
});

module.exports.general = public_users;
