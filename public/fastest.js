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