var infosElt = document.getElementById("infos");
var villesTrouve = [];
var villesUnique = [];
var inseeVille = null;
var sugElts = null;
var cp = null;

var maMap = new Map(tableauCodeMeteo);

var deux_semaines = "https://api.meteo-concept.com/api/forecast/daily?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee=";
var le_jour = "https://api.meteo-concept.com/api/forecast/daily/0?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="
var par_heure = "https://api.meteo-concept.com/api/forecast/nextHours?token=8b538e7ba129c4ba730f37d2b31a1a37b72d0accf928bb9103e90d4858f5bac2&insee="

function getMeteo(ci, selection) {

    switch (selection) {
        case "deux-semaines":
            ajaxGet(deux_semaines + ci, function(reponse) {

                var meteo = JSON.parse(reponse);

                //meteo.forecast.forEach(function(jour) {

                for (var i = 0; i < meteo.forecast.length; i++) {
                    infosElt.style.display = "flex";

                    var prevElt = document.createElement("div");
                    prevElt.classList.add("prevision");

                    var h3Elt = document.createElement("h3");
                    h3Elt.textContent = meteo.city.name;

                    var jourElt = document.createElement("p");
                    var quelJour;

                    switch (meteo.forecast[i].day) {
                        case 0:
                            quelJour = "Aurjourd'hui";
                            break;
                        case 1:
                            quelJour = "Demain";
                            break;
                        default:
                            quelJour = "Dans " + meteo.forecast[i].day + " jours";
                    }
                    jourElt.textContent = quelJour;

                    var meteoElt = document.createElement("p");
                    meteoElt.textContent = maMap.get(meteo.forecast[i].weather + "");
                    meteoElt.id = "meteo";

                    var tempElt = document.createElement("div");

                    var tminElt = document.createElement("p");
                    tminElt.textContent = meteo.forecast[i].tmin + "°C";
                    tminElt.id = "tmin";

                    var tmaxElt = document.createElement("p");
                    tmaxElt.textContent = meteo.forecast[i].tmax + "°C";

                    prevElt.appendChild(h3Elt);
                    prevElt.appendChild(document.createElement("hr"));
                    prevElt.appendChild(jourElt);
                    prevElt.appendChild(meteoElt);
                    tempElt.appendChild(tminElt);
                    tempElt.appendChild(document.createElement("hr"));
                    tempElt.appendChild(tmaxElt);
                    prevElt.appendChild(tempElt);

                    infosElt.appendChild(prevElt);
                };
            });
            break;
        case "le-jour":
            ajaxGet(le_jour + ci, function(reponse) {

                var meteo = JSON.parse(reponse);

                //meteo.forecast.forEach(function(jour) {

                infosElt.style.display = "flex";

                var prevElt = document.createElement("div");
                prevElt.classList.add("prevision");

                var h3Elt = document.createElement("h3");
                h3Elt.textContent = meteo.city.name;

                var jourElt = document.createElement("p");
                jourElt.textContent = "Aujourd'hui";

                var meteoElt = document.createElement("p");
                meteoElt.textContent = maMap.get(meteo.forecast.weather + "");

                var tempElt = document.createElement("div");

                var tminElt = document.createElement("p");
                tminElt.textContent = meteo.forecast.tmin + "°C";
                tminElt.id = "tmin";

                var tmaxElt = document.createElement("p");
                tmaxElt.textContent = meteo.forecast.tmax + "°C";

                prevElt.appendChild(h3Elt);
                prevElt.appendChild(document.createElement("hr"));
                prevElt.appendChild(jourElt);
                prevElt.appendChild(meteoElt);
                tempElt.appendChild(tminElt);
                tempElt.appendChild(document.createElement("hr"));
                tempElt.appendChild(tmaxElt);
                prevElt.appendChild(tempElt);

                infosElt.appendChild(prevElt);

                //});

            });
            break;
        case "par-heure":
            break;
    }

}


function getSelection() {

    return document.querySelector("form").elements.mode.value;
}

infosElt.addEventListener("submit", function(e) {
    e.preventDefault();
});

document.getElementById("code").addEventListener("keydown", function(e) {
    if (e.which === 13) {
        e.preventDefault();
    }
});


document.getElementById("code").addEventListener("keyup", function(e) {

    cp = document.getElementById("code").value + "";

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

                var selection = getSelection();
                getMeteo(e.target.id, selection);
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



    /*document.getElementById("nom").textContent = meteo.city.name;
    document.getElementById("meteo").textContent = meteo.forecast[0].weather;
    document.getElementById("tmin").textContent = meteo.forecast[0].tmin;
    document.getElementById("tmax").textContent = meteo.forecast[0].tmax;*/


});