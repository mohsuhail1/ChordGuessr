console.log("js file loaded") // for testing if the javascript file was loaded

// register page

document.getElementById("registerForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim(); // trimming to remove whitespaces
    const email = document.getElementById("email").value.trim();
    const age = document.getElementById("age").value.trim();
    
    const password = document.getElementById("password").value.trim();
    const confirmpassword = document.getElementById("confirmpassword").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // clear old message
    errorMessage.textContent = "";

    // validating fields
    if (!username || !email || !age || !password || !confirmpassword) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }
    
    // validating password for minimum 8 characters, capitalization, at least one number
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    if (!validatePassword(password)) {
        errorMessage.textContent = "Password must have minimum 8 characters, at least 1 lowercase, 1 uppercase and 1 number."
        return;
    }

    // checking if passwords match
    if (password != confirmpassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    // preparing local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // checking if email and username already exists
    const existingUser = users.find(
    user => user.username === username || user.email === email
    );

    if (existingUser) {
        if (existingUser.username === username) {
        errorMessage.textContent = "Username already exists.";
        } else {
        errorMessage.textContent = "Email already registered.";
        }
        return;
    }

    // pushing to HTML local storage
    users.push({ username, email, age, password }); 
    localStorage.setItem("users", JSON.stringify(users));

    // confirming registration to user
    errorMessage.style.color = "green";
    errorMessage.textContent = "Registration successful!";
});

// login page

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginMessage = document.getElementById("login-message");

    loginMessage.textContent = "";
    loginMessage.style.color="red";

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username);

    // invalid username
    if (!user) {
        loginMessage.textContent = "User not found.";
        return;
    }

    // invalid password
    if (user.password !== password) {
        loginMessage.textContent = "Incorrect password.";
        return;
    }

    // successful login
    loginMessage.style.color = "green";
    loginMessage.textContent = "Login Successful!"

    // saving logged in user
    localStorage.setItem("loggedInUser", username);

    // redirect to game page
    setTimeout(() => {
        window.location.href = "game.html";
    }, 500); // slight delay 

});


// checking if user is logged in

document.addEventListener("DOMContentLoaded", () => {
    
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loginForm = document.getElementById("loginForm");
    const loggedInInfo = document.getElementById("loggedInInfo");
    const loggedInText = document.getElementById("loggedInText");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loggedInUser) {
        // hiding login form since user is already logged in
        loginForm.style.display = "none";
        // show the user who they are currently logged in as
        loggedInInfo.style.display = "block";
        loggedInText.textContent = `Logged in as ${loggedInUser}`;
    }

    // functionality for logout button
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        // Show login form after user logs out
        loginForm.style.display = "block";
        loggedInInfo.style.display = "none";
    });
});