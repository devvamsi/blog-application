const API_URL = "http://localhost:5000/api";

// Protect only pages that require login
const protectedPages = [
    "dashboard.html",
    "create-blog.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    !localStorage.getItem("token")
) {
    window.location.href = "login.html";
}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration error:", error);

            alert("Cannot connect to backend server.");
        }
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem("user", JSON.stringify(data.user));

            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            alert("Cannot connect to backend server.");
        }
    });
}


// ===============================
// CREATE BLOG
// ===============================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const category = document.getElementById("category").value;
        const content = document.getElementById("blogContent").value;

        // Get JWT token
        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;
        }

        try {

            const response = await fetch(`${API_URL}/blog/create`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title: title,
                    content: content,
                    category: category
                })
            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Blog creation failed");

                return;
            }

            alert("Blog published successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Blog creation error:", error);

            alert("Cannot connect to backend server.");
        }
    });
}


// ===============================
// LOGIN STATUS
// ===============================

function checkLogin() {

    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    return true;
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    alert("Logged out successfully!");

    window.location.href = "login.html";
}
// ===============================
// DISPLAY BLOGS ON DASHBOARD
// ===============================

const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {
    loadBlogs();
}

async function loadBlogs() {

    try {

        const response = await fetch(`${API_URL}/blog`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load blogs");
        }

        const blogs = data.blogs;

        if (blogs.length === 0) {

            dashboardBlogs.innerHTML = `
                <p>No blogs available yet.</p>
            `;

            return;
        }

        // Get logged-in user
        const currentUser = JSON.parse(localStorage.getItem("user"));

        dashboardBlogs.innerHTML = "";

        blogs.forEach(function (blog) {

            const blogCard = document.createElement("article");

            blogCard.className = "dashboard-card";

            // Check whether this blog belongs to logged-in user
            const isOwner =
                currentUser &&
                blog.author &&
                blog.author._id === currentUser.id;

            let buttons = "";

            if (isOwner) {
                buttons = `
                    <div class="card-actions">

                        <button onclick="editBlog('${blog._id}')">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteBlog('${blog._id}')">
                            Delete
                        </button>

                    </div>
                `;
            }

            blogCard.innerHTML = `

                <h2>${blog.title}</h2>

                <p class="blog-date">
                    Category: ${blog.category || "General"}
                    | Published:
                    ${new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <p>
                    ${blog.content}
                </p>

                <p>
                    Author:
                    ${blog.author ? blog.author.name : "Unknown"}
                </p>

                ${buttons}

            `;

            dashboardBlogs.appendChild(blogCard);

        });

    } catch (error) {

        console.error("Error loading blogs:", error);

        dashboardBlogs.innerHTML = `
            <p>Unable to load blogs.</p>
        `;
    }
}
// ===============================
// EDIT BLOG
// ===============================

async function editBlog(id) {

    const title = prompt("Enter new blog title:");

    if (!title || title.trim() === "") {
        return;
    }

    const content = prompt("Enter new blog content:");

    if (!content || content.trim() === "") {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/blog/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Failed to update blog");
            return;
        }

        alert("Blog updated successfully!");

        loadBlogs();

    } catch (error) {

        console.error("Edit error:", error);

        alert("Cannot connect to backend server.");
    }
}


// ===============================
// DELETE BLOG
// ===============================

async function deleteBlog(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/blog/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Failed to delete blog");
            return;
        }

        alert("Blog deleted successfully!");

        loadBlogs();

    } catch (error) {

        console.error("Delete error:", error);

        alert("Cannot connect to backend server.");
    }
}
// ===============================
// EDIT BLOG
// ===============================

async function editBlog(id) {

    const title = prompt("Enter new blog title:");

    if (!title || title.trim() === "") {
        return;
    }

    const content = prompt("Enter new blog content:");

    if (!content || content.trim() === "") {
        return;
    }

    const category = prompt("Enter blog category:");

    if (!category || category.trim() === "") {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/blog/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                title: title,
                content: content,
                category: category
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to update blog");
            return;
        }

        alert("Blog updated successfully!");

        loadBlogs();

    } catch (error) {

        console.error("Edit error:", error);

        alert("Cannot connect to backend.");
    }
}

// ===============================
// DELETE BLOG
// ===============================

async function deleteBlog(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/blog/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete blog");
            return;
        }

        alert("Blog deleted successfully!");

        loadBlogs();

    } catch (error) {

        console.error("Delete error:", error);

        alert("Cannot connect to backend.");
    }
}