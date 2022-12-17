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

console.log(getDaysArray());