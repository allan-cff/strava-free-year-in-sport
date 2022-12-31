function getBest(storedAs, sportType, comparedData){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    return activities.reduce((best, current) => {
        if(best === null || best.type !== sportType){
            if(current.type === sportType){
                return current;
            }
            return null;
        }
        if(current.type !== sportType){
            return best;
        }
        if(current[comparedData] > best[comparedData]){
            return current;
        }
        return best;
    });
}

function getTotals(storedAs = 'totals'){
    return JSON.parse(localStorage.getItem(storedAs));
}

function getFastestRide(storedAs = 'activities'){
    return getBest(storedAs, 'Ride', 'average_speed');
}

function getFastestRun(storedAs = 'activities'){
    return getBest(storedAs, 'Run', 'average_speed');
}

function getLonguestRide(storedAs = 'activities'){
    return getBest(storedAs, 'Ride', 'distance');
}

function getLonguestRun(storedAs = 'activities'){
    return getBest(storedAs, 'Run', 'distance');
}

function getAverageDistance(sport = "Ride", storedAs = 'totals'){
    const totals = JSON.parse(localStorage.getItem(storedAs));
    return totals[sport].distance / totals[sport].count;
}

function setIcon(selector, activityType, alt){
    const icons = JSON.parse(localStorage.getItem('sport-icons'));
    fetch(icons[activityType])
    .then(response => response.text())
    .then(text => {
        document.querySelector(selector).insertAdjacentHTML('afterbegin', text);
        document.querySelector(selector + " svg").alt = alt;
    });
}

const totals = JSON.parse(localStorage.getItem('totals'));
const languages = JSON.parse(localStorage.getItem('sport-languages'));

const sportsArray = Object.keys(totals).filter(sport => sport !== "total" && sport !== "heartrate");
sportsArray.sort((a, b) => totals[b].hours - totals[a].hours);

const sport1 = sportsArray[0];
const sport2 = sportsArray[1];
let sport3;
let bestSport3;

if(getLonguestRide().distance > getLonguestRun().distance){
    sport3 = "Ride";
    bestSport3 = getLonguestRide();
} else {
    sport3 = "Run";
    bestSport3 = getLonguestRun();
}

setIcon('.fastest-sports .sport-1 .description-activite', sport1, languages.fr[sport1] || sport1)
setIcon('.fastest-sports .sport-2 .description-activite', sport2, languages.fr[sport2] || sport2)
setIcon('.longest-sport .sport-3 .description-activite', sport3, languages.fr[sport3] || sport3)
setIcon('.moyenne .sport-1-moyenne', sport1, languages.fr[sport1] || sport1)
setIcon('.moyenne .sport-2-moyenne', sport2, languages.fr[sport2] || sport2)

bestSport1 = getBest('activities', sport1, 'average_speed')
document.querySelector('.fastest-sports .sport-1').querySelector('.nombre-vitesse').innerHTML = (bestSport1.average_speed*3600/1000).toFixed(2);
document.querySelector('.fastest-sports .sport-1').querySelector('.nom-sortie').innerHTML = bestSport1.name;

bestSport2 = getBest('activities', sport2, 'average_speed')
document.querySelector('.fastest-sports .sport-2').querySelector('.nombre-vitesse').innerHTML = (bestSport2.average_speed*3600/1000).toFixed(2);
document.querySelector('.fastest-sports .sport-2').querySelector('.nom-sortie').innerHTML = bestSport2.name;

document.querySelector('.longest-sport .sport-3').querySelector('.nombre-vitesse').innerHTML = (bestSport3.distance/1000).toFixed(2);
document.querySelector('.longest-sport .sport-3').querySelector('.nom-sortie').innerHTML = bestSport3.name;

document.querySelector('.fastest-sports .sport-1').querySelector('.date').innerHTML = new Date(bestSport1.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
document.querySelector('.fastest-sports .sport-1').querySelector('.heure').innerHTML = new Date(bestSport1.start_date_local).toLocaleTimeString();

document.querySelector('.fastest-sports .sport-2').querySelector('.date').innerHTML = new Date(bestSport2.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
document.querySelector('.fastest-sports .sport-2').querySelector('.heure').innerHTML = new Date(bestSport2.start_date_local).toLocaleTimeString();

document.querySelector('.longest-sport .sport-3').querySelector('.date').innerHTML = new Date(bestSport3.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
document.querySelector('.longest-sport .sport-3').querySelector('.heure').innerHTML = new Date(bestSport3.start_date_local).toLocaleTimeString();

document.querySelector('.moyenne .sport-1-moyenne').querySelector('.nombre-moyenne').innerHTML = (getAverageDistance(sport1)/1000).toFixed(2);
document.querySelector('.moyenne .sport-2-moyenne').querySelector('.nombre-moyenne').innerHTML = (getAverageDistance(sport2)/1000).toFixed(2);