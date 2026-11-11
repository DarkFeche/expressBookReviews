const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Registro de usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Tarea 10: Obtener la lista de libros usando Async/Await con Axios o Promesas
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Tarea 11: Obtener detalles del libro basado en ISBN usando Promesas
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});
  
// Tarea 12: Obtener detalles del libro basado en Autor usando Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        let matchingBooks = [];
        Object.keys(books).forEach((key) => {
          if (books[key].author === author) {
            matchingBooks.push({ isbn: key, ...books[key] });
          }
        });
        resolve(matchingBooks);
      });
    };

    const filteredBooks = await getBooksByAuthor();
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Tarea 13: Obtener detalles del libro basado en Título usando Promesas
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("Title not found");
    }
  });

  getBooksByTitle
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Obtener reseñas de un libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
