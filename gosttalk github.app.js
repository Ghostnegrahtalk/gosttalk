let users = [];  // Store users in an array
let posts = [];  // Store posts in an array
let chatlogs = {};  // Store chatlogs in an object (chat code as key)
let loggedInUser = null;  // Current logged-in user

// Function to log in or sign up
function loginSignup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (!username || !password) {
        return alert("Please enter both username and password!");
    }

    // Hash the password using SHA256 for secure storage
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Check if user exists
    const existingUser = users.find(user => user.username === username);
    
    if (existingUser) {
        // If user exists, check password
        if (existingUser.password !== hashedPassword) {
            return alert("Incorrect password!");
        }
        loggedInUser = existingUser;
    } else {
        // If new user, add to users list
        const newUser = { username, password: hashedPassword };
        users.push(newUser);
        loggedInUser = newUser;
    }

    // Show content after login/signup
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("content").style.display = "flex";

    updateFeed();
}

// Create Post
function createPost() {
    const postText = document.getElementById("newPost").value.trim();
    const media = document.getElementById("mediaUpload").files[0];

    if (!postText && !media) {
        return alert("Please enter some text or upload media!");
    }

    const newPost = {
        username: loggedInUser.username,
        text: postText,
        media: media ? URL.createObjectURL(media) : '',
        likes: 0,
        comments: [],
        id: Date.now()
    };

    posts.unshift(newPost);  // Add to the beginning of the feed
    updateFeed();
    document.getElementById("newPost").value = "";
    document.getElementById("mediaUpload").value = "";
}

// Update Feed
function updateFeed() {
    const feedDiv = document.getElementById("feed");
    feedDiv.innerHTML = "";  // Clear previous posts

    posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";
        postDiv.innerHTML = `
            <strong>${post.username}</strong>: ${post.text}
            ${post.media ? (post.media.endsWith("mp4") ? 
                `<video controls><source src="${post.media}" type="video/mp4"></video>` : 
                `<img src="${post.media}" alt="Post Image" />`) : ''}
            <br />
            <button onclick="likePost(${post.id})">Like</button>
            <button onclick="commentPost(${post.id})">Comment</button>
            <div id="comments-${post.id}"></div>
        `;
        feedDiv.appendChild(postDiv);
    });
}

// Like a Post
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        updateFeed();
    }
}

// Comment on a Post
function commentPost(postId) {
    const commentText = prompt("Enter your comment:");
    if (commentText) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(commentText);
            const commentsDiv = document.getElementById(`comments-${postId}`);
            commentsDiv.innerHTML = `<strong>Comments:</strong><ul>${post.comments.map(c => `<li>${c}</li>`).join('')}</ul>`;
        }
    }
}

// Create Chatlog
function createChatlog() {
    const chatCode = prompt("Enter a code to create a new chatlog:");
    if (chatCode) {
        chatlogs[chatCode] = [];
        alert("Chatlog created! Share the code to join.");
    }
}

// Join Chatlog
function joinChatlog() {
    const chatCode = document.getElementById("chatCode").value.trim();
    if (!chatlogs[chatCode]) {
        return alert("Chatlog not found. Please check the code.");
    }

    alert(`Joined chatlog: ${chatCode}`);
    // Further chat functionalities can be added here
}

// Search the web
function searchWeb() {
    const query = document.getElementById("searchQuery").value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
}
