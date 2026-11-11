const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Verificar si el usuario ya existe en el registro
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};

// Verificar si las credenciales coinciden con algún registro
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
};

// Login para usuarios registrados
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in: missing credentials" });
    }

    if (authenticatedUser(username, password)) {
        // Generar token JWT de acceso
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Almacenar el token y nombre de usuario en la sesión
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Agregar o actualizar una reseña de libro (Tarea 9)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    const username = req.session.authorization['username'];

    if (books[isbn]) {
        // Asignar o sobreescribir la reseña correspondiente a este usuario
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// Eliminar una reseña de libro (Tarea 10)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
        } else {
            return res.status(404).json({ message: `No review found for user ${username} on ISBN ${isbn}` });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
