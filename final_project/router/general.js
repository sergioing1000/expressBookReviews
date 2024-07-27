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
      console.log(users)
      return res.status(200).json({message: `User ${username} successfully registered. Now you can login`});
    } else {
      console.log(users)
      return res.status(404).json({message: `User ${username} already exists!`});
    }
  }

  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  
  async function fetchBooks (){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4; // 60% chance of success, 40% chance of failure

        if (success) {
          resolve (books);
        } else {
          reject(new Error('Server Error: Failed to fetch books'));
        }
      },  Math.random() * 1000);
   });
  };

  try{

    const fethcedBooks = await fetchBooks();
    res.status(200).send(JSON.stringify(fethcedBooks,null,4));

  }catch (error){
    res.status(500).send({ error: error.message });
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbnToSearch = req.params.isbn;
  console.log("ISBN ato be search is: " + isbnToSearch)

  async function findBookByISBN (isbnToSearch){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4; // 60% chance of success, 40% chance of failure

        if (success) {

          for (let key in books) {
            if (books[key]["ISBN-10"] === isbnToSearch) {
              resolve (books[key]);
            }
          }
          resolve (null); 
          
        } else {
          reject(new Error('Server Error: Failed to fetch books'));
        }
      }, 1000);
   });
  };

  try {
    let book = await findBookByISBN(isbnToSearch);
      if (book) {
        console.log(book);
        res.status(200).send(book);
      } else {
        res.status(404).send({message: "Book Not Found with the ISBN " + isbnToSearch});
      }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }

});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const authorToSearch = req.params.author;
  console.log("the author to search is : " + authorToSearch)

  async function findBookByAuthor (authorToSearch){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4; // 60% chance of success, 40% chance of failure

        if (success) {

          for (let key in books) {
            if (books[key]["author"] === authorToSearch) {
              resolve (books[key]);
            }
          }
          resolve (null); 
          
        } else {
          reject(new Error('Server Error: Failed to fetch books'));
        }
      }, 1000);
   });
  };

  try {
    let book = await findBookByAuthor(authorToSearch);
      if (book) {
        console.log(book);
        res.status(200).send(book);
      } else {
        res.status(404).send({message: "Book Not Found with the Author " + authorToSearch});
      }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  
  const titleToSearch = req.params.title;
  console.log("the title to search is : " + titleToSearch)


  async function findBookByTitle (titleToSearch){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4; // 60% chance of success, 40% chance of failure

        if (success) {

          for (let key in books) {
            if (books[key]["title"] === titleToSearch) {
              resolve (books[key]);
            }
          }
          resolve (null); 
          
        } else {
          reject(new Error('Server Error: Failed to fetch books'));
        }
      }, 1000);
   });
  };

  try {
    let book = await findBookByTitle(titleToSearch);
      if (book) {
        console.log(book);
        res.status(200).send(book);
      } else {
        res.status(404).send({message: "Book Not Found with the title " + titleToSearch});
      }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const isbnToSearch = req.params.isbn;

  console.log(isbnToSearch);

  let findBookByISBN = function (isbnToSearch) {
    for (let key in books) {
      if (books[key]["ISBN-10"] === isbnToSearch) {
          return books[key].reviews;
      }
    }
    return null; 
  };
    
  let reviews = findBookByISBN(isbnToSearch);

  console.log(reviews)

  if (reviews) {
    console.log(reviews);
    res.status(200).send(reviews);
  } else {
    console.log("Book not found.");
    return res.status(404).json({message:"Not Book found"});
  }

});

module.exports.general = public_users;