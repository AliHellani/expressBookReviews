const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require('./users');

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
//return typeof username === 'string' && username.length > 0;
console.log('Checking valid:', username);
if(typeof username ==='string' && username.length > 0){
  return true;
} else {
  return false;
}
}


//const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
//console.log('Checking user:', username, password);
//return users.some(user => user.username === username && user.password === password);
//}

/*const authenticatedUser = (username,password)=>{ 
 
 
  console.log('Checking user:', username, password);
  return users.some(user => {
    console.log('User in data:', user.username, user.password);
    return user.username === username && user.password === password;
  });
}*/
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    console.log('Checking user in data:', user.username, user.password);
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


/*
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}
*/


//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('isValid:', isValid(username));
console.log('authenticatedUser:', authenticatedUser(username, password));
  console.log('Login attempt:', username, password);
  if (isValid(username) && authenticatedUser(username, password)) {
    // If the username is valid and the password is correct, create a token and send it to the client
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 });
   //const token = jwt.sign({username },'access',{expiresIn: 60*60});
   req.session.authorization = {
    accessToken,username
}
    console.log('Token generated:', accessToken);
    return res.status(200).send("User successfully logged in");
  } else {
    // If the username is not valid or the password is incorrect, send an error message
    return res.status(401).json({ message: "Invalid username or password" });
    
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewContent = req.query.review;
  const username = req.session.authorization.username;
  // Find the book with the given ISBN
  let book = books.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  // Find the review by the current user
  let review = book.reviews.find(review => review.username === username);
  if (review) {
    // If the review exists, modify it
    review.content = reviewContent;
  } else {
    // If the review does not exist, add it
    book.reviews.push({ username: username, content: reviewContent });
  }
  return res.status(200).json({ message: "Review successfully added/modified" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
