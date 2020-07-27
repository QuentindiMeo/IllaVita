const proxy = "https://cors-anywhere.herokuapp.com/";
const bsURL = "https://trefle.io/api/v1/species/";
const token = "ZBDIZY3pQJv9PkdjooE7zGtDWVYE4z7JJw3Zy2csxg0";
const nNeed = `It looks like all of your plants are<br>doing well at the moment! Great job!`;
const nPlnt = `It looks like you have no plants at the moment...<br>Go to the Search tab and add you some!`;
const Auser = localStorage.getItem("connected");
const nEmpN = ["start", [{water: [""], spray: [""], ferti: [""]},Auser]];
const empty = [{usnm: "name", cont:["plant"]}];

if (localStorage.getItem("connected") == "")
    goto('main')
if (!localStorage.getItem("inv"))
    localStorage.setItem("inv", JSON.stringify([empty]));
if (localStorage.getItem("needs") == 'undefined' ||
    !localStorage.getItem("needs"))
        localStorage.setItem("needs", JSON.stringify(nEmpN));
var needs = getNeeds(JSON.parse(localStorage.getItem("needs")));
document.getElementById('hello').innerHTML = getHello();
if      (invEmpty())        document.getElementById('status').innerHTML = nPlnt;
else if (gotNoNeeds(needs)) document.getElementById('status').innerHTML = nNeed;
else                        displayNeeds();

function delSection(secNam)
{
    var docbody = document.getElementById('body');
    var section = document.getElementById(secNam);
    const w = 'water',  s = 'spray',  f = 'ferti';

    if (section)
        docbody.removeChild(section);
    if (!(document.getElementById(w)) && !(document.getElementById(s)) &&
        !(document.getElementById(f)))
            document.getElementById('status').innerHTML = nNeed;
}

function updateNeeds(needs)
{
    var allNeeds = JSON.parse(localStorage.getItem("needs"));

    for (j = 0; j < allNeeds.length; j++)
        if (allNeeds[j][1] == Auser)
            allNeeds[j] = needs;
    localStorage.setItem("needs", JSON.stringify(allNeeds));
}

function delFromNeeds(type, name)
{
    var isDone = false;
    i = 1;

    if (type == "water") {
        for (; i < needs[0].water.length && isDone != true; i++)
            if (needs[0].water[i] == name)
                isDone = true;
        needs[0].water.splice(i - 1, 1);
    } else if (type == "spray") {
        for (; i < needs[0].spray.length && isDone != true; i++)
            if (needs[0].spray[i] == name)
                isDone = true;
        needs[0].spray.splice(i - 1, 1);
    } else {
        for (; i < needs[0].ferti.length && isDone != true; i++)
            if (needs[0].ferti[i] == name)
                isDone = true;
        needs[0].ferti.splice(i - 1, 1);
    }
    updateNeeds(needs);
}

function plantDone(elemidx, name)
{
    var targDoc  = document.getElementById(elemidx.substr(0, 5));
    var elem     = document.getElementById(elemidx);
    const brName = "br" + elemidx.substr(0, 5);

    targDoc.removeChild(elem);
    if (document.getElementById(brName))
        targDoc.removeChild(document.getElementById(brName));
    if (document.getElementById(brName))
        targDoc.removeChild(document.getElementById(brName));
    else
        delSection(elemidx.substr(0, 5));
    delFromNeeds(elemidx.substr(0, 5), name);
    if (needs[0].water.length < 2 && needs[0].spray.length < 2 &&
        needs[0].ferti.length < 2) {
        delSection('water'); delSection('spray'); delSection('ferti');
    }
}

function getName(elem, idx)
{
    if      (elem == 'water') return (needs[0].water[idx]);
    else if (elem == 'spray') return (needs[0].spray[idx]);
    else                      return (needs[0].ferti[idx]);
}

function displayNeedsFor(elem, idx)
{
    var doc = document.getElementById(elem);
    const limit = (elem == 'water') ? needs[0].water.length :
          (elem == 'spray') ? needs[0].spray.length : needs[0].ferti.length;

    doc.style.display = "block";
    for (i = 1; i < limit; i++) {
        const pName   = getName(elem, i);
        var   plant   = document.createElement('button');
        const elemidx = elem + "#" + i;
        if (i > 1) {
            var br1 = document.createElement('br');
            var br2 = document.createElement('br');
            br1.setAttribute('id', "br" + elem); doc.appendChild(br1);
            br2.setAttribute('id', "br" + elem); doc.appendChild(br2);
        }
        plant.setAttribute('id', elemidx);
        plant.setAttribute('class', "plant");
        plant.setAttribute('onclick', "plantDone('" + elemidx + "', " +
                                                "'" +  pName  + "')");
        var text = document.createTextNode(pName);
        plant.appendChild(text);
        doc.appendChild(plant);
    }
}

function displayNeeds()
{
    document.getElementById('status').innerHTML = "";
    if (needs[0].water.length > 1) displayNeedsFor('water', 0);
    if (needs[0].spray.length > 1) displayNeedsFor('spray', 1);
    if (needs[0].ferti.length > 1) displayNeedsFor('ferti', 2);
}

function getNeeds(allneeds)
{
    var isDone  = false;
    var myNeeds = [{water: [""], spray: [""], ferti: [""]},Auser];

    for (i = 0; i < allneeds.length && !isDone; i++)
        if (allneeds[i][1] == Auser) {
            myNeeds = allneeds[i]; isDone = true;
        }
    if (!isDone) {
        allneeds.push(myNeeds);
        localStorage.setItem("needs", JSON.stringify(allneeds));
    }
    return (myNeeds);
}

function invEmpty()
{
    const invs = JSON.parse(localStorage.getItem("inv"));

    for (k = 0; k < invs.length; k++) {
        var uName = invs[k].usnm;
        if      (uName == Auser && invs[k].cont.length == 0) return (true);
        else if (uName == Auser) return (false);
    }
    return (true);
}

function gotNoNeeds(n)
{
    if (n[0].water.length < 2 && n[0].spray.length < 2 && n[0].ferti.length < 2)
        return (true);
    if (invEmpty())
        return (true);
    return (false);
}

function getHello()
{
    return (`Hello,<b class="nfont">` + Auser + `!</b>`);
}

function goto(target)
{
    window.location.href = target + ".html";
}
