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

function getAverageRideDistance(storedAs = 'activities'){
    const totals = JSON.parse(localStorage.getItem('totals'));
    return totals.ride.distance / totals.ride.count;
}

console.log(getFastestRide());
console.log(getFastestRun());
console.log(getLonguestRide());
console.log(getLonguestRun());
console.log(getAverageRideDistance());
console.log('2021 values : ');
console.log(getFastestRide('2021-activities'));
console.log(getFastestRun('2021-activities'));
console.log(getLonguestRide('2021-activities'));
console.log(getLonguestRun('2021-activities'));

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

const sport1Elem = document.querySelector('.fastest-sports .sport-1');
const sport2Elem = document.querySelector('.fastest-sports .sport-2');
const sport3Elem = document.querySelector('.longest-sport .sport-3');

if(sport1 === 'Run'){
    sport1Elem.querySelector('img').src = './images/cap.svg';
    sport1Elem.querySelector('img').alt = 'Course à pieds';
}
if(sport1 === 'Ride'){
    sport1Elem.querySelector('img').src = './images/velo.svg';
    sport1Elem.querySelector('img').alt = 'Cyclisme';
}

if(sport2 === 'Run'){
    sport2Elem.querySelector('img').src = './images/cap.svg';
    sport2Elem.querySelector('img').alt = 'Course à pieds';
}
if(sport2 === 'Ride'){
    sport2Elem.querySelector('img').src = './images/velo.svg';
    sport2Elem.querySelector('img').alt = 'Cyclisme';
}

if(sport3 === 'Run'){
    sport3Elem.querySelector('img').src = './images/cap.svg';
    sport3Elem.querySelector('img').alt = 'Course à pieds';
}
if(sport3 === 'Ride'){
    sport3Elem.querySelector('img').src = './images/velo.svg';
    sport3Elem.querySelector('img').alt = 'Cyclisme';
}

bestSport1 = getBest('activities', sport1, 'average_speed')
sport1Elem.querySelector('.nombre-vitesse').innerHTML = (bestSport1.average_speed*3600/1000).toFixed(2);
sport1Elem.querySelector('.nom-sortie').innerHTML = bestSport1.name;

bestSport2 = getBest('activities', sport2, 'average_speed')
sport2Elem.querySelector('.nombre-vitesse').innerHTML = (bestSport2.average_speed*3600/1000).toFixed(2);
sport2Elem.querySelector('.nom-sortie').innerHTML = bestSport2.name;

sport3Elem.querySelector('.nombre-vitesse').innerHTML = (bestSport3.distance/1000).toFixed(2);
sport3Elem.querySelector('.nom-sortie').innerHTML = bestSport3.name;

sport1Elem.querySelector('.date').innerHTML = new Date(bestSport1.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
sport1Elem.querySelector('.heure').innerHTML = new Date(bestSport1.start_date_local).toLocaleTimeString();

sport2Elem.querySelector('.date').innerHTML = new Date(bestSport2.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
sport2Elem.querySelector('.heure').innerHTML = new Date(bestSport2.start_date_local).toLocaleTimeString();

sport3Elem.querySelector('.date').innerHTML = new Date(bestSport3.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
sport3Elem.querySelector('.heure').innerHTML = new Date(bestSport3.start_date_local).toLocaleTimeString();
