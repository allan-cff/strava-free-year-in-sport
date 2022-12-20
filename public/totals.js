function getTotals(){
    return JSON.parse(localStorage.getItem('totals'));
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

console.log(getTotals());
console.log(getClimbByMonth());
console.log(getDistanceByMonth());
console.log('2021 Values : ');
console.log(getTotals('2021-activities'));
console.log(getClimbByMonth('2021-activities'));
console.log(getDistanceByMonth('2021-activities'));