const Auser    = localStorage.getItem("connected");
const empUsers = [{usnm: "admin", pswd: "admin", pfp: ""}];
const nEmpN = ["start", [{water: [""], spray: [""], ferti: [""]},Auser]];
const empty = [{usnm: "name", cont:["plant"]}];

if (localStorage.getItem("connected") == "")
    goto('main')
if (!localStorage.getItem("inv"))
    localStorage.setItem("inv", JSON.stringify([empty]));
if (localStorage.getItem("needs") == 'undefined' ||
    !localStorage.getItem("needs"))
	localStorage.setItem("needs", JSON.stringify(nEmpN));
document.getElementById('name').innerHTML = getName();
fetchImg();

function getImgLink(users)
{
    var lnk    = null;
//"https://icons-for-free.com/iconfiles/png/512/high+quality+media+messenger+social+social+media+square-1320192616538808256.png";    icone messenger test
    var isDone = false;

    for (i = 0; i < users.length && !isDone; i++)
        if (users[i].usnm == Auser) {
            lnk = users[i].pfp; isDone = true;
        }
    if (lnk == null || lnk == "")
        return (null);
    return (lnk);
}

function fetchImg()
{
    const unknown = "https://static.thenounproject.com/png/994628-200.png";
    var link = getImgLink(JSON.parse(localStorage.getItem("users")));
    var img  = document.getElementById("accPfp");

    img.src = (link === null) ? unknown	: link;
    img.alt = "user profile picture";
}

function logout()
{
    localStorage.setItem("connected", "");
    goto('main');
}

function fullWipe()
{
    if (localStorage.getItem("connected") == "admin") {
        alert("Wiping...");      localStorage.clear();
        localStorage.setItem("users", JSON.stringify(empUsers));
        localStorage.setItem("connected", "admin");
    } else
        alert("This is an admin command.");
}

function wI()
{
    var invs  = JSON.parse(localStorage.getItem("inv"));
    var ns    = JSON.parse(localStorage.getItem("needs"));
    var i = 1, j = 1;

    if (localStorage.getItem("inv")) {
        for (; i < invs.length; i++)
            if (invs[i].usnm == Auser) {
                invs[i].cont = [];
                break;
            }
        if (i != invs.length) {
            localStorage.setItem("inv", JSON.stringify(invs));
            for (; j < ns.length; j++) {
                if (ns[j][1] == Auser) {
                    ns[j][0].water = [""];
                    ns[j][0].spray = [""];
                    ns[j][0].ferti = [""];
                    break;
                }
            }
            localStorage.setItem("needs", JSON.stringify(ns));
        }
    }
    alert("Your inventory was successfully wiped.");
}

function disp()
{
    if (localStorage.getItem("connected") == "admin")
        console.log(JSON.parse(localStorage.getItem("inv")));
    else
        alert("This is an admin command.");
}

function getName()
{
    return (`<b class="nfont">` + Auser + `</b>`);
}

function goto(target)
{
    window.location.href = target + ".html";
}
