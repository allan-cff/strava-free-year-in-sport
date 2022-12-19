function getTotals(storedAs = 'activities'){
    const totals = {
        ytd_total_climb : 0,
        ytd_total_distance : 0,
        ytd_ride_climb : 0,
        ytd_ride_distance : 0,
        ytd_run_distance : 0,
        ytd_ride_distance : 0,
        ytd_swim_distance : 0
    };
    const activities = JSON.parse(localStorage.getItem(storedAs));
    for(const activity of activities){
        totals.ytd_total_climb = totals.ytd_total_climb + activity.total_elevation_gain;
        totals.ytd_total_distance = totals.ytd_total_distance + activity.distance;
        if(activity.type === "Ride"){
            totals.ytd_ride_climb = totals.ytd_ride_climb + activity.total_elevation_gain;
            totals.ytd_ride_distance = totals.ytd_ride_distance + activity.distance;
        } else {
            if(activity.type === "Run"){
                totals.ytd_run_distance = totals.ytd_run_distance + activity.total_elevation_gain;
                totals.ytd_run_distance = totals.ytd_run_distance + activity.distance;
            } else {
                if(activity.type === "Swim"){
                    totals.ytd_swim_distance = totals.ytd_swim_distance + activity.distance;
                }
            }
        }
    }
    return totals;
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