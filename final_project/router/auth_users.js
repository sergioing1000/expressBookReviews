const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const userIsValid = (username)=>{ //returns boolean
    //write code to check is the username is valid

    // The username to check
    const usernameToCheck = username;

    // Check if the username exists in the array
    const userExists = users.some(user => user.username === usernameToCheck);

    if (userExists) {
        console.log(`User ${usernameToCheck} exists.`);
        return true;

    } else {
        console.log(`User ${usernameToCheck} does not exist.`);
        return false;
    }
}

const findBookByISBN = function (isbnToSearch) {
    for (let key in books) {
      if (books[key]["ISBN-10"] === isbnToSearch) {
          return books[key];
      }
    }
    return null;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 20 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.body.username;
    const review = req.body.review;
    const isbn = req.params.isbn;
    
  //Write your code here
  console.log("The username is : " + username);
  console.log("the revbiew is: " + review);
  console.log("The ISBN is: " + isbn);

  function addReview(isbn, review, username) {
    for (let key in books) {
        if (books[key]["ISBN-10"] === isbn) {
            let reviewId = Object.keys(books[key].reviews).length + 1;

                let reviewFound = false;

                for (let id in books[key].reviews) {
                    if (books[key].reviews[id].username === username) {
                        books[key].reviews[id].review = review;
                        reviewFound = true;
                        break;
                    }
                }

                if (!reviewFound) {
                    const newId = String(Object.keys(books[key].reviews).length + 1);
                    books[key].reviews[newId] = {
                        "username": username,
                        "review": review
                    };
                }
                //books[key].reviews[reviewId] = {username, review};

            return `Review added to book with ISBN ${isbn}`;
        }
    }
    return `Book with ISBN ${isbn} not found`;
  }

  if (userIsValid(username)){

    if (findBookByISBN(isbn)){

        console.log(addReview(isbn, review, username));

        console.log(books);

        return res.status(302).json({message: `the ${username} and the ISBN ${isbn } are valid and have been fopund`});
      }
      else{
        return res.status(206).json({message: `the ${username} is valid but the ISBN ${isbn} is NOT VALID` });
      }
  }
  else{
    return res.status(404).json({message: `Inavlid username.`})
  }
  
});

// Delete a book review
regd_users.delete ( "/auth/review/:isbn", (req, res) => {

    const username = req.body.username;
    const isbn = req.params.isbn;

    console.log(isbn);
    console.log(username)

        return res.status(501).json({message: "Yet to be implementyed..."});
});

module.exports.authenticated = regd_users;
//module.exports.userIsValid = userIsValid;
module.exports.users = users;