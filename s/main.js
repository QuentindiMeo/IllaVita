const empUsers = [{usnm: "admin", pswd: "admin", pfp: ""}];

if (!localStorage.getItem("users"))
    localStorage.setItem("users", JSON.stringify(empUsers));

function home(usnm)
{
    alert("Welcome home, " + usnm + ".");
    localStorage.setItem("connected", usnm);
    window.location.href = "home.html";
}

function login()
{
    var  users = JSON.parse(localStorage.getItem("users"));
    const usnm = document.getElementById("username").value.trim().toUpperCase();
    const pswd = document.getElementById("password").value;

    for (i = 0; i < users.length; i++) {
        if (usnm == users[i].usnm.toUpperCase() && pswd == users[i].pswd) {
            console.log(users[i].usnm + " just logged in.");
            home(users[i].usnm);
            return;
        }
    }
    alert("Incorrect username or password.");
    return;
}

function register()
{
    var   users = JSON.parse(localStorage.getItem("users"));
    const nUsnm = document.getElementById("nUsername").value.trim();
    const nPswd = document.getElementById("nPassword").value;
    const cPswd = document.getElementById("cPassword").value;
    const newUser = {usnm: nUsnm, pswd: nPswd, pfp: ""};

    if (nUsnm.length < 1) { alert("Please enter a username."); return; }
    if (nUsnm  == "name") { alert("Please enter a username."); return; }
    if (nPswd != cPswd)   { alert("Passwords don't match.");   return; }
    for (i = 0; i < users.length; i++) {
        if (nUsnm == users[i].usnm) {
            alert("Username " + nUsnm + " is already taken.");
            return;
        }
        if (nPswd.length < 7) {
            alert("Please enter a password with 7 characters or more.");
            return;
        }
    }
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("You were successfully registered.");
}
