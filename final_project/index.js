const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuración del middleware de sesión para las rutas de clientes
app.use("/customer", session({ 
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true 
}));

// Middleware de autenticación para proteger todas las rutas bajo /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    // 1. Verificar si existe el objeto de autorización dentro de la sesión activa
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // 2. Verificar la validez del token JWT usando la clave secreta "access"
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Inyectar los datos del usuario en la solicitud
                next();          // Permitir el paso hacia el endpoint correspondiente
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT = 5000;

// Montaje de las rutas en el servidor
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
