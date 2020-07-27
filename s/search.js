const Auser = localStorage.getItem("connected");
const proxy = "https://cors-anywhere.herokuapp.com/";
const bsURL = "https://trefle.io/api/v1/species/";
const token = "ZBDIZY3pQJv9PkdjooE7zGtDWVYE4z7JJw3Zy2csxg0";
const nEmpN = ["start", [{water: [""], spray: [""], ferti: [""]},Auser]];
const empty = [{usnm: "name", cont:["plant"]}];
var   dData = null;
var   toAdd = "";

if (localStorage.getItem("connected") == "")
    goto('main')
if (!localStorage.getItem("inv"))
    localStorage.setItem("inv", JSON.stringify([empty]));
if (localStorage.getItem("needs") == 'undefined' ||
    !localStorage.getItem("needs"))
        localStorage.setItem("needs", JSON.stringify(nEmpN));

function getNeeds(allNeeds)
{
    var isDone  = false;
    var myNeeds = null;

    for (i = 0; i < allNeeds.length; i++)
	if (allNeeds[i][1] == Auser) {
            myNeeds = allNeeds[i]; break;
        }
    return (myNeeds);
}

function addToNeeds(plant, foli, spec, grow)
{
    var allNeeds = JSON.parse(localStorage.getItem("needs"));
    var myNeeds  = getNeeds(allNeeds);

    if (grow.soil_humidity > 2 == 'null' ||
        grow.atmospheric_humidity > 2 || grow.soil_humidity > 2)
        myNeeds[0].water.push(plant);
    if (foli.texture == "medium" || foli.texture == "coarse")
        myNeeds[0].spray.push(plant);
    if (grow.soil_nutriments > 6)
        myNeeds[0].ferti.push(plant);
    localStorage.setItem("needs", JSON.stringify(allNeeds));
}

function addToInv(plant)
{
    var inventory  = JSON.parse(localStorage.getItem("inv"));
    var newInv     = {usnm: Auser, cont:[plant]};
    var isDone     = false;

    for (i = 0; i < inventory.length && !isDone; i++)
        if (inventory[i].usnm == Auser) {
            inventory[i].cont.push(plant); isDone = true;
        }
    if (isDone == false)
        inventory.push(newInv);
    localStorage.setItem("inv", JSON.stringify(inventory));
}

function add()
{
    var msgSuccess = "";
    var inventory  = JSON.parse(localStorage.getItem("inv"));

    if (toAdd.length == 0) return;
    if (typeof add.count   == 'undefined') add.count = 1;
    if (typeof add.prec    == 'undefined') add.prec  = "";
    if (toAdd.length != 0) {
        if (toAdd == add.prec) add.count++;
        else                   add.count = 1;
        msgSuccess = "This plant was added to library (+" + add.count + ")";
        addToInv(toAdd);
        addToNeeds(toAdd, dData.foliage, dData.specifications, dData.growth);
    }
    add.prec = toAdd;
    document.getElementById('success').innerHTML = msgSuccess;
}

function fetchImg(link)
{
    const unknown = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1024px-Question_mark_%28black%29.svg.png";
    var img = document.getElementById('plantImg');

    img.setAttribute('style', "padding: 5px");
    if (link == "") {
        img.setAttribute('style', "padding: 0");
        img.src = "";
        img.alt = "";
    } else {
        img.src = (link === null) ? unknown : link;
        img.alt = "plant image";
    }
}

var gotInfo = function(data)
{
    dData = data.data;
    document.getElementById("BA").style.display = "inline-block";
    const betterImg = (dData.images.bark.length == 0) ? dData.image_url
                                       : dData.images.bark[0].image_url;
    fetchImg(betterImg);
}

function capF(s) {
    return (s.replace(/\w\S*/g, function(txt){
        return (txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase());}));
}
function capf(s)
{
    if (s === null)
        return ("");
    return (s[0].toUpperCase() + s.slice(1));
}

var gotData = function(data)
{
    var names = "plant couldn't be found...";
    var caped = (data.data.length != 0) ?
        capf(data.data[0].common_name) : null;

    if (data.data.length != 0) {
        if (data.data[0].common_name != null) {
            names = `<b>` + caped + `</b>` +
                    `<br><b>(${data.data[0].scientific_name})</b>`;
        } else
            names = `<b>${data.data[0].scientific_name}</b>`;
    }
    document.getElementById('plantNames').innerHTML = names;
    if (data.data.length == 0) {
        toAdd = "";
        fetchImg(toAdd);
        document.getElementById("BA").style.display = "none";
        return;
    }
    toAdd = capF(data.data[0].scientific_name);
    $.get(proxy + bsURL + data.data[0].slug + "?token=" + token,
          gotInfo).done(function() {});
}

function search()
{
    const plant = document.getElementById('plantName').value.trim();

    if (plant == "") {
        alert("Please enter a plant's name.");
        return;
    }
    document.getElementById('success').innerHTML = "";
    $.get(proxy + bsURL + "search?q=" + plant + "&limit=1&token=" + token,
          gotData).done(function() {
          })
        .fail(function() {
            alert("Failed to reach the API. Try again later.");
        });
}

function goto(target)
{
    window.location.href = target + ".html";
}
