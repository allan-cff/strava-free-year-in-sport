function getTotals(){
    const athleteStats = JSON.parse(localStorage.getItem('athlete'));
    const totals = {};
    totals.ytd_total_climb = athleteStats.ytd_ride_totals.elevation_gain + athleteStats.ytd_run_totals.elevation_gain;
    totals.ytd_total_distance = athleteStats.ytd_ride_totals.distance + athleteStats.ytd_run_totals.distance + athleteStats.ytd_swim_totals.distance;
    totals.ytd_ride_climb = athleteStats.ytd_ride_totals.elevation_gain;
    totals.ytd_run_climb = athleteStats.ytd_run_totals.elevation_gain;
    totals.ytd_ride_distance = athleteStats.ytd_ride_totals.distance;
    totals.ytd_run_distance = athleteStats.ytd_run_totals.distance;
    totals.ytd_swim_distance = athleteStats.ytd_swim_totals.distance;
    return totals;
}

function getClimbByMonth(){
    const activities = JSON.parse(localStorage.getItem('activities'));
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

function getDistanceByMonth(){
    const distanceByMonth = {};
    const activities = JSON.parse(localStorage.getItem('activities'));
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