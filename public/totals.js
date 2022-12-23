function getTotals(storedAs = 'totals'){
    return JSON.parse(localStorage.getItem(storedAs));
}

function getClimbByMonth(storedAs = 'activities'){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    const climbByMonth = {};
    for(let i = 1; i < 13; i++){
        climbByMonth[i] = 0;
    }
    for(const activity of activities){
        const actMonth = new Date(activity.start_date_local).getMonth() + 1;
        climbByMonth[actMonth] = climbByMonth[actMonth] + activity.total_elevation_gain;
    }
    return climbByMonth;
}

function getDistanceByMonth(storedAs = 'activities'){
    const distanceByMonth = {};
    const activities = JSON.parse(localStorage.getItem(storedAs));
    for(let i = 1; i < 13; i++){
        distanceByMonth[i] = 0;
    }
    for(const activity of activities){
        const actMonth = new Date(activity.start_date_local).getMonth() + 1;
        distanceByMonth[actMonth] = distanceByMonth[actMonth] + activity.distance;
    }
    return distanceByMonth;
}

function normalizeValue(numToNormalize){
    if(numToNormalize > 1000){
        numToNormalize = (numToNormalize/1000).toFixed(3);
    } else {
        numToNormalize = numToNormalize.toFixed(0);
    }
    return numToNormalize;
}

console.log(getTotals());
console.log(getClimbByMonth());
console.log(getDistanceByMonth());
console.log('2021 Values : ');
console.log(getTotals('2021-activities'));
console.log(getClimbByMonth('2021-activities'));
console.log(getDistanceByMonth('2021-activities'));

document.querySelector('.denivele .nombre-denivele').innerHTML = normalizeValue(getTotals().total.climb);
const climbByMonth = getClimbByMonth();
let bestMonthClimb = 0;
let bestMonthClimbValue = 0;
for(const [key, value] of Object.entries(climbByMonth)){
    if(value > bestMonthClimbValue){
        bestMonthClimbValue = value;
        bestMonthClimb = key - 1;
    }
}
const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
document.querySelector('.denivele .record-denivele').innerHTML = `En ${months[bestMonthClimb]}, vous avez cumulé ${normalizeValue(bestMonthClimbValue)}m de d+.`;
document.querySelector('.distance .nombre-distance').innerHTML = normalizeValue(getTotals().total.distance/1000);
const distanceByMonth = getDistanceByMonth();
let bestMonthDistance = 0;
let bestMonthDistanceValue = 0;
for(const [key, value] of Object.entries(distanceByMonth)){
    if(value > bestMonthDistanceValue){
        bestMonthDistanceValue = value;
        bestMonthDistance = key - 1;
    }
}
console.log(bestMonthDistanceValue)
document.querySelector('.distance .record-distance').innerHTML = `En ${months[bestMonthDistance]}, vous avez parcouru ${normalizeValue(bestMonthDistanceValue/1000)}km - votre plus gros mois !`;
document.querySelector('.comp-2021 .nb-deni-2021').innerHTML = normalizeValue(getTotals('2021-totals').total.climb);
document.querySelector('.comp-2021 .nb-dis-2021').innerHTML = normalizeValue(getTotals('2021-totals').total.distance/1000);