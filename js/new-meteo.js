var leftSide = document.getElementById("left-side");
var rightSide = document.getElementById("right-side");
var bottomSide = document.getElementById("bottom-side");

var villesTrouve = [];
var villesUnique = [];
var inseeVille;
var sugElts;
var ci;

var maMap = new Map(tableauCodeMeteo);

var deux_semaines = "https://api.meteo-concept.com/api/forecast/daily?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee=";
//var le_jour = "https://api.meteo-concept.com/api/forecast/daily/0?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="
var par_tranche = "https://api.meteo-concept.com/api/forecast/daily/periods?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="

var laMeteo;

var days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
var months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Nov', 'Dec'];

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

let svgArr = document.querySelectorAll("svg");
// Get the bounds of the SVG content
svgArr.forEach(svg => {
    // Update the width and height using the size of the contents
    let bbox = svg.getBBox();
    svg.setAttribute("width", bbox.x + bbox.width + bbox.x);
    svg.setAttribute("height", bbox.y + bbox.height + bbox.y);
});

//let day = document.querySelectorAll(".day");

/*function updateSVGColor(theDay) {
    if (!theDay.classList.contains("selected")) {
        let img = theDay.querySelector("img");
        if (!theDay.classList.contains("active")) {
            img.setAttribute("src", img.getAttribute("src").replace("black", "white"));
        } else {
            img.setAttribute("src", img.getAttribute("src").replace("white", "black"));
        }
    }
}

day.forEach(theDay => {

    updateSVGColor(theDay);

    theDay.addEventListener("mouseenter", function() {
        theDay.classList.toggle("active");
        updateSVGColor(this);
    });
    theDay.addEventListener("mouseleave", function() {
        theDay.classList.remove("active");
        updateSVGColor(this);
    });

});*/

function getIcon(x) {
    let icon = "";

    if (x == 0) {
        icon = "soleil";
    } else if (x == 1) {
        icon = "eclaicie";
    } else if ((x >= 2 && x <= 5) || x == 235) {
        icon = "nuageux";
    } else if (x == 6 || x == 7) {
        icon = "brouillard";
    } else if ((x >= 10 && x <= 16) || x == 140 || (x >= 210 && x <= 212)) {
        icon = "pluie";
    } else if ((x >= 20 && x <= 22) || (x >= 220 && x <= 222) || x == 142) {
        icon = "neige";
    } else if (x >= 40 && x <= 48) {
        icon = "averse";
    } else if ((x >= 100 && x <= 108) || (x >= 120 && x <= 128) || (x >= 130 && x <= 138)) {
        icon = "orage";
    } else {
        icon = "else"
    }

    return icon;
}

function getMeteo(ci) {

    var villeElt = leftSide.querySelector("#info-day p:last-child");
    var jourElt = leftSide.querySelector("#info-day h3");

    var dateElt = leftSide.querySelector("#info-day p:first-of-type");
    var tempElt = leftSide.querySelector("#data h2");
    var weatherElt = leftSide.querySelector("#data p");

    var humiditeElt = rightSide.querySelector("#humidite .data-value");
    var windElt = rightSide.querySelector("#vent .data-value");

    var dateAjd = new Date();
    var heure = dateAjd.getHours();
    var laPeriode;

    ajaxGet(par_tranche + ci, function(reponse) {

        laMeteo = JSON.parse(reponse);

        if (heure >= 2 && heure < 8) {
            laPeriode = laMeteo.forecast[0][1];
            document.getElementById("illu").style.background = "url('images/nuit.png')";
            document.getElementById("illu").style.backgroundPositionY = '0px';
        }


        if (heure >= 8 && heure < 14) {

            laPeriode = laMeteo.forecast[0][2];
            document.getElementById("illu").style.background = "url('images/midi.png')";
            document.getElementById("illu").style.backgroundPositionY = '-130px';
        }

        if (heure >= 14 && heure < 20) {
            laPeriode = laMeteo.forecast[0][3];
            document.getElementById("illu").style.background = "url('images/matin-soir.png')";
            document.getElementById("illu").style.backgroundPositionY = '-120px';
        }

        if (heure >= 20 || heure < 2) {
            laPeriode = laMeteo.forecast[0][0];
            document.getElementById("illu").style.background = "url('images/nuit.png')";
            document.getElementById("illu").style.backgroundPositionY = '0px';
        }

        var date = new Date(laPeriode.datetime);

        if (date.getDate() < 10) {
            dateElt.textContent = "0" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        } else {
            dateElt.textContent = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        }

        jourElt.textContent = days[date.getDay()];

        villeElt.textContent = laMeteo.city.name;
        tempElt.textContent = laPeriode.temp2m + "°C";

        let iconName = getIcon(laPeriode.weather);

        leftSide.querySelector("#data img").setAttribute("src", "images/icons/SVG/" + iconName + "-black.svg");

        weatherElt.textContent = iconName.capitalize(); //maMap.get(laPeriode.weather + "");

        //30 - 32 / 141 / 230 - 232
        //60 - 70
        //71 - 78

        windElt.textContent = laPeriode.wind10m + " km/h";

        //autre periode de la journee
        for (var i = 1; i <= 4; i++) {

            //si i = 4, passe au jour suivant (1) et on prends la periode nuit (0)
            if (i == 4) {
                laPeriode = laMeteo.forecast[1][0];
            } else {
                laPeriode = laMeteo.forecast[0][i];
            }

            var meteoTranche = maMap.get(laPeriode.weather + "");
            var periodElt;

            switch (i) {
                case 1:
                    periodElt = bottomSide.querySelector("#matin");
                    break;
                case 2:
                    periodElt = bottomSide.querySelector("#midi");
                    break;
                case 3:
                    periodElt = bottomSide.querySelector("#soir");
                    break;
                case 4:
                    periodElt = bottomSide.querySelector("#nuit");
                    break;
            }
            let iconName = getIcon(laPeriode.weather);

            if (!rightSide.querySelectorAll(".day")[i - 1].classList.contains("selected")) {
                (rightSide.querySelectorAll(".day")[i - 1]).querySelector("img").setAttribute("src", "images/icons/SVG/" + iconName + "-white.svg");
            } else {
                (rightSide.querySelectorAll(".day")[i - 1]).querySelector("img").setAttribute("src", "images/icons/SVG/" + iconName + "-black.svg");
            }
            //updateSVGColor(rightSide.querySelectorAll(".day")[i - 1]);

            periodElt.querySelector("h3").textContent = laPeriode.temp2m + " °C";

        }

        //prochain jour
        for (var i = 0; i < 4; i++) {

            leJour = laMeteo.forecast[i][2];

            var meteoTranche = maMap.get(leJour.weather + "");
            var prochainJourElt;

            switch (i) {
                case 0:
                    prochainJourElt = rightSide.querySelector("#zero");
                    break;
                case 1:
                    prochainJourElt = rightSide.querySelector("#un");
                    break;
                case 2:
                    prochainJourElt = rightSide.querySelector("#deux");
                    break;
                case 3:
                    prochainJourElt = rightSide.querySelector("#trois");
                    break;
            }

            if (date.getDay() + i < days.length) {
                prochainJourElt.querySelector("p").textContent = days[date.getDay() + i];
            } else {
                prochainJourElt.querySelector("p").textContent = days[(date.getDay() + i) % (days.length - 1)];
            }
            prochainJourElt.querySelector("h3").textContent = leJour.temp2m + " °C";


            let iconName = getIcon(laPeriode.weather);
            bottomSide.querySelectorAll(".period")[i].querySelector("img").setAttribute("src", "images/icons/SVG/" + iconName + "-white.svg");

            periodElt.querySelector("h3").textContent = laPeriode.temp2m + " °C";

        }

        document.getElementById("popup").style.display = "none";
        document.getElementById("meteo").style.display = "block";

    });

}

leftSide.addEventListener("submit", function(e) {
    e.preventDefault();
});

document.getElementById("code").addEventListener("keydown", function(e) {
    if (e.which === 13) {
        e.preventDefault();
    }
});

document.getElementById("changeCP").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("code").value = "";
    document.getElementById("popup").style.display = "flex";
    document.getElementById("meteo").style.display = "none";
});


document.getElementById("code").addEventListener("keyup", function(e) {

    var cp = document.getElementById("code").value + "";

    villesTrouve = [];
    villesUnique = [];
    sugElts = document.getElementById("suggestions");
    sugElts.innerHTML = "";


    var i = 0;
    var count = Object.keys(code).length;

    while (i < count) {
        var test = code[i].Code_postal + "";

        if (cp.indexOf(cp) === test.indexOf(cp)) {

            ville = new Object();
            ville.nom = code[i].Nom_commune;
            ville.cp = code[i].Code_postal;
            ville.ci = code[i].Code_commune_INSEE;

            villesTrouve.push(ville);
        }

        i++;
    };


    var dupli = false;
    if (villesTrouve.length < 50) {
        for (var i = 0; i < villesTrouve.length; i++) {

            dupli = false;

            for (var y = 0; y < villesTrouve.length - 1 && y !== i; y++) {
                if (villesTrouve[i].nom.localeCompare(villesTrouve[y].nom) === 0) {
                    dupli = true;
                }
            }

            if (dupli == false) {
                villesUnique.push(villesTrouve[i]);
            }
        }

        villesUnique.sort((a, b) => {
            let fa = a.nom.toLowerCase(),
                fb = b.nom.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });


        var nb_tour = villesUnique.length < 10 ? villesUnique.length : 10;

        for (var i = 0; i < nb_tour; i++) {

            var suggestionElt = document.createElement("div");
            suggestionElt.classList.add("suggestion");
            suggestionElt.id = villesUnique[i].ci;

            suggestionElt.textContent = villesUnique[i].nom + ", " + villesUnique[i].cp;

            suggestionElt.addEventListener("click", function(e) {

                document.getElementById("code").value = e.target.textContent;
                sugElts.innerHTML = "";
                sugElts.style.borderWidth = "0px";

                //var selection = getSelection();
                getMeteo(e.target.id);

                ci = e.target.id;
            });

            document.getElementById("suggestions").appendChild(suggestionElt);
        }

        if (villesUnique.length > 10) {

            var suggestionElt = document.createElement("div");
            suggestionElt.classList.add("more")
            suggestionElt.textContent = "...";

            document.getElementById("suggestions").appendChild(suggestionElt);
        }

        sugElts.style.width = document.getElementById("code").clientWidth + "px";
        document.getElementById("entry").appendChild(sugElts);
    }
    if (sugElts.childElementCount > 0) {
        sugElts.style.borderWidth = "1px";
    } else {
        sugElts.style.borderWidth = "0px";
    }

});