function getDaysArray(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    const daysActive = [];
    for(const activity of activities){
        const actDate = new Date(activity.start_date_local);
        const actDateString = `${actDate.getFullYear()}-${actDate.getMonth()+1}-${actDate.getDate()}`
        if(!(daysActive.find(day => day === actDateString))){
            daysActive.push(actDateString);
        }
    }
    return daysActive;
}

function getSportPercentage(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    let yearlyDuration = 0;
    const sportDuration = {};
    for(const activity of activities){
        yearlyDuration += activity.moving_time;
        if(sportDuration[activity.sport_type] === undefined){
            sportDuration[activity.sport_type] = activity.moving_time;
        } else {
            sportDuration[activity.sport_type] += activity.moving_time;
        }
    }
    for(const [key, value] of Object.entries(sportDuration)){
        console.log(key, value);
        sportDuration[key] = value / yearlyDuration;
    }
    return sportDuration;    
}

console.log(getDaysArray());
console.log(getSportPercentage())