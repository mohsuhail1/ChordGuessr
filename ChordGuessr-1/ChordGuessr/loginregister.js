console.log("js file loaded")

document.getElementById("registerForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim(); // trimming to remove whitespaces
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmpassword = document.getElementById("confirmpassword").value.trim();
     const errorMessage = document.getElementById("errorMessage");

    // clear old message
    errorMessage.textContent = "";

    if (!username || !email || !password || !confirmpassword) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }

    // checking if passwords match

    if (password != confirmpassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

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

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // If all checks pass
    errorMessage.style.color = "green";
    errorMessage.textContent = "Registration successful!";

    



});