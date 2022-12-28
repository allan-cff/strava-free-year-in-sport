function getHoursByMonth(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    const timeByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(const activity of activities){
        const actDate = new Date(activity.start_date_local);
        timeByMonth[actDate.getMonth()] = timeByMonth[actDate.getMonth()] + activity.moving_time/60/60
    }
    return timeByMonth;
}

function getHours(storedAs = 'activities'){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    let hours = 0;
    for(const activity of activities){
        hours += activity.moving_time/60/60
    }
    return hours;    
}

console.log(getHoursByMonth());
console.log(getHours());
console.log(getHours('2021-activities'));

document.querySelector('#heures .nombre-xxl').innerHTML = getHours().toFixed(0);
document.querySelector('#comp-21 h2:nth-child(2)').innerHTML = getHours('2021-activities').toFixed(0).toString(10) + 'H';