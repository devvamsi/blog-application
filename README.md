# MyBlog - Full Stack Blog Application

MyBlog is a full-stack blog application built with HTML, CSS, JavaScript, Node.js, Express.js and MongoDB.

Users can register, log in securely using JWT authentication, create blogs, view blogs, edit their own blogs and delete their own blogs.

## Features

- User registration
- User login
- JWT authentication
- Protected dashboard
- Create blog posts
- View all blog posts
- Edit your own blogs
- Delete your own blogs
- Blog ownership protection
- MongoDB database
- REST APIs
- Responsive frontend
- Logout functionality

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)

## Project Structure

```text
blog-application/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── css/
│   └── style.css
│
├── javascript/
│   └── script.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── .gitignore
└── README.md
