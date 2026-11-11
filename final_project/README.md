Practice-Project

# Express Online Bookstore Backend API

A RESTful backend service for an online bookstore built with Node.js and Express.js. This application handles user authentication, book catalog queries, and review management using sessions, JWT authorisation, and asynchronous operations (Promises & Async/Await with Axios).

---

## 🛠️ Tech Stack & Features

* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **Authentication & Authorisation:** `jsonwebtoken` (JWT) & `express-session`
* **Asynchronous Operations:** Promises & `async/await` pattern using Axios
* **Architecture:** RESTful API with modular routing architecture

---

## 🚀 API Endpoints

### Public Endpoints
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieve the complete catalog of books |
| `GET` | `/isbn/:isbn` | Fetch details of a specific book by ISBN |
| `GET` | `/author/:author` | Search books by author name |
| `GET` | `/title/:title` | Search books by title |
| `GET` | `/review/:isbn` | Retrieve customer reviews for a specified book |
| `POST` | `/register` | Register a new user account |

### Authenticated Endpoints (Protected by JWT & Session)
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/customer/login` | Authenticate user and initiate session |
| `PUT` | `/customer/auth/review/:isbn` | Add or update a book review (Query param: `review`) |
| `DELETE` | `/customer/auth/review/:isbn` | Delete a review posted by the logged-in user |

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have Node.js and npm installed on your system.

### 2. Installation
Clone the repository and install the required dependencies:

```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/expressBookReview.git](https://github.com/YOUR_GITHUB_USERNAME/expressBookReview.git)
cd expressBookReview/final_project
npm install
