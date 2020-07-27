const proxy = "https://cors-anywhere.herokuapp.com/";
const bsURL = "https://trefle.io/api/v1/species/";
const token = "ZBDIZY3pQJv9PkdjooE7zGtDWVYE4z7JJw3Zy2csxg0";
const empty = [{usnm: "name", cont:["plant"]}];
const Auser = localStorage.getItem("connected");
const inv   = getInv(JSON.parse(localStorage.getItem("inv")));

if (localStorage.getItem("connected") == "")
    goto('main')
if (!localStorage.getItem("inv"))
    localStorage.setItem("inv", JSON.stringify([empty]));
document.getElementById('name').innerHTML = getName();
document.getElementById('size').innerHTML = getSize(inv);
getGarden(inv);

function getDetails(foli, spec, grow)
{
    var desc = "";
    if (grow.soil_humidity > 2 == 'null' ||
        grow.atmospheric_humidity > 2 || grow.soil_humidity > 2) {
        if      (grow.soil_humidity > 8)
            desc += "Needs water:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; every day";
        else if (grow.soil_humidity > 5)
            desc += "Needs water:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; thrice a week";
        else
            desc += "Needs water:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; twice a week";
    }
    if (foli.texture == "medium" || foli.texture == "coarse") {
        if (desc != "")
            desc += "<br>";
        desc += "Needs spraying: once a week";
    }
    if (grow.soil_nutriments > 6) {
        if (desc != "")
            desc += "<br>";
        desc += "Needs fertilizer:&nbsp; once a week";
    }
    if (desc != "")
        return (desc);
    return ("It doesn't need anything!<br>Let it live and it will be happy!");
}

var getInfos = function(data)
{
    var obj   = document.getElementById('inv-entry-desc');
    var oDesc = document.createElement('p');
    var desc  = "...";/*waiting*/

    if (data.data) {
        const dData = data.data;
        const betterImg = (dData.images.bark.length == 0) ? dData.image_url
                                           : dData.images.bark[0].image_url;
        fetchImg(betterImg);
        desc = getDetails(dData.foliage, dData.specifications, dData.growth);
        oDesc.setAttribute('class', "desc");
        oDesc.innerHTML = desc;
        obj.removeChild(obj.lastChild);
        obj.appendChild(oDesc);
    }
    return (desc);
}

var getData = function(d)
{$.get(proxy+bsURL+d.data[0].slug+"?token="+token,getInfos).done(function(){});}

function adjustPadding(sSize)
{
    return ("bottom: " + ((getNDSize(inv) - 1) * 93.5 + 160) + "px");
}

function dispDetails(name)
{
    var obj  = document.getElementById('inv-entry-desc');
    var desc = document.createElement('p');
    var pImg = document.createElement('img');

    while (obj.firstChild)
        obj.removeChild(obj.firstChild);
    pImg.setAttribute('id', "pImg");
    obj.setAttribute('style', adjustPadding(getSize(inv)));
    obj.appendChild(pImg);
    fetchImg("https://static.thenounproject.com/png/658625-200.png");/*waiting*/
    desc.setAttribute('class', "desc");
    desc.innerHTML = getInfos(name);
    $.get(proxy + bsURL + "search?q=" + name + "&limit=1&token=" + token,
          getData).done(function() {
          })
	.fail(function() {
            alert("Failed to reach the API. Try again later.");
	});
    obj.appendChild(desc);
}

function getNb(a, s)
{
    var nb = 0;

    for (idx = 0; idx < a.length; idx++)
        if (a[idx] == s)
            nb++;
    if (nb == 1)
        return ("");
    return (" (" + nb + ")");
}

function getGarden(tInv)
{
    var doc  = document.getElementById("inv-list");
    var disp = [""];

    for (i = 0; i < tInv.length; i++) {
        if (disp.includes(tInv[i]))
            continue;
        var plant = document.createElement('div');
        if (i > 0)
            doc.appendChild(document.createElement('hr'));
        plant.setAttribute('class', "inv-entry");
        var text = document.createElement('p');
        text.innerHTML = tInv[i] + getNb(tInv, tInv[i]);
        text.setAttribute('class', "inv-entry-name");
        plant.appendChild(text);
        var btn = document.createElement('button');
        btn.setAttribute('class', "btn btn-info inv-entry-btn");
        btn.innerHTML = "<b>></b>";
        btn.setAttribute('onclick', "dispDetails('" + tInv[i] + "')");
	plant.appendChild(btn);
        doc.appendChild(plant);
        disp.push(tInv[i]);
    }
}

function getNDSize(tInv)
{
    var size = 0;
    var disp = [""];

    for (i = 0; i < tInv.length; i++) {
	if (disp.includes(tInv[i]))
            continue;
        size++;
        disp.push(tInv[i]);
    }
    return (size);
}

function getSize(tInv)
{
    document.getElementById('inv-list').style.display = "block";
    if (tInv == null || (tInv != null && tInv.length == 0)) {
        document.getElementById('inv-list').style.display = "none";
        return "You currently own<b>no</b>plant.";
    } else if (tInv.length == 1)
        return "You currently own<b>1</b>plant.";
    return "You currently own<b>" + tInv.length + "</b>plants.";
}

function getInv(invs)
{
    var isDone = false;
    var myInv = {usnm: Auser, cont:[]};

    for (i = 0; i < invs.length && !isDone; i++)
        if (invs[i].usnm == Auser) {
            myInv = invs[i].cont; isDone = true;
        }
    if (!isDone) {
        invs.push(myInv);
        localStorage.setItem("inv", JSON.stringify(invs));
        return ([]);
    }
    return (myInv);
}

function getName()
{
    return (`<b  class="nfont">` + Auser + `'s</b>garden`);
}

function fetchImg(link)
{
    const unknown = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1024px-Question_mark_%28black%29.svg.png";
    var img = document.getElementById('pImg');

    if (link == "") {
        img.src = "";
	img.alt = "";
    } else {
        img.src = (link === null) ? unknown : link;
        img.alt = "plant image";
    }
}

function goto(target)
{
    window.location.href = target + ".html";
}
