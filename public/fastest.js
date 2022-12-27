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
    return totals[sport.toLowerCase()].distance / totals[sport.toLowerCase()].count;
}

const totals = JSON.parse(localStorage.getItem('totals'));
let sport1;
let sport2;
let sport3;
let bestSport3;

if(totals.run.hours > totals.ride.hours && totals.run.hours > totals.swim.hours){
    sport1 = 'Run';
    sport2 = 'Ride';
}

if(totals.ride.hours > totals.run.hours && totals.ride.hours > totals.swim.hours){
    sport1 = 'Ride';
    sport2 = 'Run';
}

if(getLonguestRide().distance > getLonguestRun().distance){
    sport3 = "Ride";
    bestSport3 = getLonguestRide();
} else {
    sport3 = "Run";
    bestSport3 = getLonguestRun();
}

const sport1FastestElem = document.querySelector('.fastest-sports .sport-1');
const sport2FastestElem = document.querySelector('.fastest-sports .sport-2');
const longuestElem = document.querySelector('.longest-sport .sport-3');
const sport1AverageElem = document.querySelector('.moyenne .sport-1-moyenne');
const sport2AverageElem = document.querySelector('.moyenne .sport-2-moyenne');

if(sport1 === 'Run'){
    sport1FastestElem.querySelector('img').src = './images/run-black.svg';
    sport1FastestElem.querySelector('img').alt = 'Course à pieds';
    sport1AverageElem.querySelector('img').src = './images/run-white.svg';
    sport1AverageElem.querySelector('img').alt = 'Course à pieds';
}
if(sport1 === 'Ride'){
    sport1FastestElem.querySelector('img').src = './images/bike-black.svg';
    sport1FastestElem.querySelector('img').alt = 'Cyclisme';
    sport1AverageElem.querySelector('img').src = './images/bike-white.svg';
    sport1AverageElem.querySelector('img').alt = 'Cyclisme';
}

if(sport2 === 'Run'){
    sport2FastestElem.querySelector('img').src = './images/run-white.svg';
    sport2FastestElem.querySelector('img').alt = 'Course à pieds';
    sport2AverageElem.querySelector('img').src = './images/run-white.svg';
    sport2AverageElem.querySelector('img').alt = 'Course à pieds';
}
if(sport2 === 'Ride'){
    sport2FastestElem.querySelector('img').src = './images/bike-white.svg';
    sport2FastestElem.querySelector('img').alt = 'Cyclisme';
    sport2AverageElem.querySelector('img').src = './images/bike-white.svg';
    sport2AverageElem.querySelector('img').alt = 'Cyclisme';
}

if(sport3 === 'Run'){
    longuestElem.querySelector('img').src = './images/run-black.svg';
    longuestElem.querySelector('img').alt = 'Course à pieds';
}
if(sport3 === 'Ride'){
    longuestElem.querySelector('img').src = './images/bike-black.svg';
    longuestElem.querySelector('img').alt = 'Cyclisme';
}

bestSport1 = getBest('activities', sport1, 'average_speed')
sport1FastestElem.querySelector('.nombre-vitesse').innerHTML = (bestSport1.average_speed*3600/1000).toFixed(2);
sport1FastestElem.querySelector('.nom-sortie').innerHTML = bestSport1.name;

bestSport2 = getBest('activities', sport2, 'average_speed')
sport2FastestElem.querySelector('.nombre-vitesse').innerHTML = (bestSport2.average_speed*3600/1000).toFixed(2);
sport2FastestElem.querySelector('.nom-sortie').innerHTML = bestSport2.name;

longuestElem.querySelector('.nombre-vitesse').innerHTML = (bestSport3.distance/1000).toFixed(2);
longuestElem.querySelector('.nom-sortie').innerHTML = bestSport3.name;

sport1FastestElem.querySelector('.date').innerHTML = new Date(bestSport1.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
sport1FastestElem.querySelector('.heure').innerHTML = new Date(bestSport1.start_date_local).toLocaleTimeString();

sport2FastestElem.querySelector('.date').innerHTML = new Date(bestSport2.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
sport2FastestElem.querySelector('.heure').innerHTML = new Date(bestSport2.start_date_local).toLocaleTimeString();

longuestElem.querySelector('.date').innerHTML = new Date(bestSport3.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
longuestElem.querySelector('.heure').innerHTML = new Date(bestSport3.start_date_local).toLocaleTimeString();

sport1AverageElem.querySelector('.nombre-moyenne').innerHTML = (getAverageDistance(sport1)/1000).toFixed(2);
sport2AverageElem.querySelector('.nombre-moyenne').innerHTML = (getAverageDistance(sport2)/1000).toFixed(2);