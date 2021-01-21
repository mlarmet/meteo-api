var infosElt = document.getElementById("infos");
var infosSpeElt = document.getElementById("infos-spe");

var villesTrouve = [];
var villesUnique = [];
var inseeVille;
var sugElts;
var ci;

var maMap = new Map(tableauCodeMeteo);

var deux_semaines = "https://api.meteo-concept.com/api/forecast/daily?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee=";
//var le_jour = "https://api.meteo-concept.com/api/forecast/daily/0?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="
var par_tranche = "https://api.meteo-concept.com/api/forecast/daily/periods?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="

var days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getMeteo(ci) {

    infosElt.innerHTML = "";
    var h3Elt = document.getElementById("nom");
    if (h3Elt !== null) {
        h3Elt.remove();
    }

    document.getElementById("infos-spe").innerHTML = "";

    var date = new Date();

    var dateElt = document.createElement("div");
    dateElt.classList.add("jour");

    var jourElt = document.createElement("p");
    jourElt.textContent = "" + days[date.getDay()];

    var nbJourElt = document.createElement("p");
    nbJourElt.textContent = "" + date.getDate();

    dateElt.appendChild(jourElt);
    dateElt.appendChild(nbJourElt);


    /*switch (selection) {

        case "deux-semaines":*/
    ajaxGet(deux_semaines + ci, function(reponse) {

        var meteo = JSON.parse(reponse);

        var h3Elt = document.createElement("h3");
        h3Elt.id = "nom";
        h3Elt.textContent = meteo.city.name;

        document.body.insertBefore(h3Elt, infosElt);

        for (var i = 0; i < 7; i++) {
            (function() {
                var prevElt = document.createElement("div");
                prevElt.classList.add("prevision");

                var meteoElt = document.createElement("p");
                meteoElt.textContent = maMap.get(meteo.forecast[i].weather + "");
                meteoElt.classList.add("meteo");

                var tempElt = document.createElement("div");
                tempElt.classList.add("temperature");

                var tminElt = document.createElement("p");
                tminElt.textContent = meteo.forecast[i].tmin + "°C";

                var tmaxElt = document.createElement("p");
                tmaxElt.textContent = meteo.forecast[i].tmax + "°C";
                tmaxElt.classList.add("tmax");

                var dateElt = document.createElement("div");
                dateElt.classList.add("jour");

                var jourDansLeMois = daysInMonth(date.getFullYear(), date.getMonth());
                var numDuJour = date.getDate() + i;

                if (numDuJour > jourDansLeMois) {
                    numDuJour -= jourDansLeMois;
                }

                var jourElt = document.createElement("p");
                jourElt.textContent = "" + days[((date.getDay() + i) % 7)];

                var nbJourElt = document.createElement("p");
                nbJourElt.textContent = "" + numDuJour;

                dateElt.appendChild(jourElt);
                dateElt.appendChild(nbJourElt);

                prevElt.appendChild(dateElt);

                prevElt.appendChild(meteoElt);
                tempElt.appendChild(tminElt);
                tempElt.appendChild(document.createElement("hr"));
                tempElt.appendChild(tmaxElt);
                prevElt.appendChild(tempElt);

                infosElt.appendChild(prevElt);

                prevElt.id = i + "jour";

                prevElt.addEventListener("click", function(e) {

                    infosElt.childNodes.forEach(fils => {
                        fils.style.border = "0";
                    });

                    prevElt.style.borderTop = "4px solid black";

                    infosSpeElt.innerHTML = "";

                    var witch = Number(prevElt.id.charAt(0));

                    document.querySelector("body > hr").style.borderTop = "0.5px solid grey";

                    ajaxGet(par_tranche + ci, function(reponse) {

                        var meteo = JSON.parse(reponse);

                        for (var i = 0; i < 4; i++) {

                            var prevSpeElt = document.createElement("div");
                            prevSpeElt.classList.add("prevision-spe");

                            var trancheElt = document.createElement("p");
                            var tranche;

                            switch (meteo.forecast[witch][i].period) {
                                case 0:
                                    tranche = "02h - 08h";
                                    break;
                                case 1:
                                    tranche = "08h - 14h";
                                    break;
                                case 2:
                                    tranche = "14h - 20h";
                                    break;
                                case 3:
                                    tranche = "20h - 02h";
                                    break;

                            }

                            if (witch === 0) {
                                if (i === 0 && (date.getHours() >= 2 && date.getHours() < 8)) {
                                    prevSpeElt.style.borderTop = "6px solid black";
                                } else if (i === 1 && (date.getHours() >= 8 && date.getHours() < 14)) {
                                    prevSpeElt.style.borderTop = "6px solid black";
                                } else if (i === 2 && (date.getHours() >= 14 && date.getHours() < 20)) {
                                    prevSpeElt.style.borderTop = "6px solid black";
                                } else if (i === 3 && ((date.getHours() >= 20 && date.getHours() <= 23) || (date.getHours() >= 0 && date.getHours() < 2))) {
                                    prevSpeElt.style.borderTop = "6px solid black";
                                }
                            }


                            trancheElt.textContent = tranche;

                            var meteoElt = document.createElement("p");
                            meteoElt.textContent = maMap.get(meteo.forecast[witch][i].weather + "");
                            meteoElt.classList.add("meteo-spe");

                            var tempElt = document.createElement("div");

                            var tmaxElt = document.createElement("p");
                            tmaxElt.textContent = meteo.forecast[witch][i].temp2m + "°C";


                            prevSpeElt.appendChild(trancheElt);
                            prevSpeElt.appendChild(meteoElt);
                            tempElt.appendChild(tmaxElt);
                            prevSpeElt.appendChild(tempElt);

                            infosSpeElt.appendChild(prevSpeElt);
                        };

                    });

                });

            }());
        };
    });
    /*break;
        case "le-jour":
            ajaxGet(le_jour + ci, function(reponse) {

                var meteo = JSON.parse(reponse);

                var h3Elt = document.createElement("h3");
                h3Elt.id = "nom";
                h3Elt.textContent = meteo.city.name;

                document.body.insertBefore(h3Elt, infosElt);

                var prevElt = document.createElement("div");
                prevElt.classList.add("prevision");

                var meteoElt = document.createElement("p");
                meteoElt.textContent = maMap.get(meteo.forecast.weather + "");
                meteoElt.classList.add("meteo");

                var tempElt = document.createElement("div");

                var tminElt = document.createElement("p");
                tminElt.textContent = meteo.forecast.tmin + "°C";

                var tmaxElt = document.createElement("p");
                tmaxElt.textContent = meteo.forecast.tmax + "°C";
                tmaxElt.classList.add("tmax");

                prevElt.appendChild(dateElt);
                prevElt.appendChild(meteoElt);
                tempElt.appendChild(tminElt);
                tempElt.appendChild(document.createElement("hr"));
                tempElt.appendChild(tmaxElt);
                prevElt.appendChild(tempElt);

                infosElt.appendChild(prevElt);


            });
            break;
        case "par-tranche":

            ajaxGet(par_tranche + ci, function(reponse) {

                var meteo = JSON.parse(reponse);

                var h3Elt = document.createElement("h3");
                h3Elt.id = "nom";
                h3Elt.textContent = meteo.city.name;

                document.body.insertBefore(h3Elt, infosElt);

                for (var i = 0; i < 4; i++) {

                    var prevElt = document.createElement("div");
                    prevElt.classList.add("prevision");

                    var trancheElt = document.createElement("p");
                    var tranche;

                    switch (meteo.forecast[0][i].period) {
                        case 0:
                            tranche = "02h - 08h";
                            break;
                        case 1:
                            tranche = "08h - 14h";
                            break;
                        case 2:
                            tranche = "14h - 20h";
                            break;
                        case 3:
                            tranche = "20h - 02h";
                            break;

                    }
                    trancheElt.textContent = tranche;

                    var meteoElt = document.createElement("p");
                    meteoElt.textContent = maMap.get(meteo.forecast[0][i].weather + "");
                    meteoElt.classList.add("meteo");

                    var tempElt = document.createElement("div");

                    var tmaxElt = document.createElement("p");
                    tmaxElt.textContent = meteo.forecast[0][i].temp2m + "°C";


                    prevElt.appendChild(trancheElt);
                    prevElt.appendChild(meteoElt);
                    tempElt.appendChild(tmaxElt);
                    prevElt.appendChild(tempElt);

                    infosElt.appendChild(prevElt);
                };

            });

            break;
    }*/
}

/*function getSelection() {

    if (getComputedStyle(document.getElementById("pc-choice")).display === "block") {
        return document.querySelector("form").elements.mode.value;
    } else {
        return document.getElementById("mobile-choice").options[document.getElementById("mobile-choice").selectedIndex].value;
    }

}*/

infosElt.addEventListener("submit", function(e) {
    e.preventDefault();
});

document.getElementById("code").addEventListener("keydown", function(e) {
    if (e.which === 13) {
        e.preventDefault();
    }
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
                infosElt.innerHTML = "";
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