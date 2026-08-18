# MyBlog - Full Stack Blog Application

MyBlog is a full-stack blog application built using HTML, CSS, JavaScript, Node.js, Express.js and MongoDB.

## Features

- User registration
- User login
- JWT authentication
- Create blog posts
- View all blogs
- Edit your own blogs
- Delete your own blogs
- Blog ownership protection
- MongoDB database
- REST APIs
- Logout
- Protected dashboard

## Technologies

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Blogs

POST /api/blog/create

GET /api/blog

PUT /api/blog/:id

DELETE /api/blog/:id

## How to Run

### Backend

```bash
cd backend
npm install
node server.js