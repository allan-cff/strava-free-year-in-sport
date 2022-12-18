function getHoursByMonth(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    const timeByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(const activity of activities){
        const actDate = new Date(activity.start_date_local);
        timeByMonth[actDate.getMonth()] = timeByMonth[actDate.getMonth()] + activity.moving_time/60/60
    }
    return timeByMonth;
}

console.log(getHoursByMonth());