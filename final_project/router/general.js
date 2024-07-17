const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    console.log (`El Username es: ${username}`);
    console.log (`La Clave es: ${password}`)
    console.log(`-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*`)

    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: `User ${username} successfully registered. Now you can login`});
    } else {
        return res.status(404).json({message: `User ${username} already exists!`});
    }
  }

  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbnToSearch = req.params.isbn;

  console.log("el isbn a buscar es:" + isbnToSearch)

  let findBookByISBN = function (isbnToSearch) {
    for (let key in books) {
      if (books[key]["ISBN-10"] === isbnToSearch) {
          return books[key];
      }
    }
    return null; 
  };

  let book = findBookByISBN(isbnToSearch);

  if (book) {
    console.log(book);
    res.status(200).send(book);
  } else {
    console.log("Book not found.");
    return res.status(404).json({message:"Not Book found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorToSearch = req.params.author;

  console.log("the author to search is : " + authorToSearch)
  
  let findBookByAuthor = function (authorToSearch) {
    for (let key in books) {
      if (books[key]["author"] === authorToSearch) {
          return books[key];
      }
    }
    return null; 
  };
  
  let book = findBookByAuthor(authorToSearch);
  
  if (book) {
    console.log(book);
    res.status(200).send(book);
  } else {
    console.log("Book not found.");
    return res.status(404).json({message:"Not Book found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
