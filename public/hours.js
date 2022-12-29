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

function getBestMonth(hoursByMonth){
    maxMonth = 0;
    for(let i = 0; i < 12; i++){
        if(hoursByMonth[i] > hoursByMonth[maxMonth]){
            maxMonth = i;
        }
    }
    return maxMonth;
}

console.log(getHoursByMonth());
console.log(getHours());
console.log(getHours('2021-activities'));

const hoursByMonth = getHoursByMonth();
const bestMonthId = getBestMonth(hoursByMonth);
document.querySelector('#heures .nombre-xxl').innerHTML = getHours().toFixed(0);
document.querySelector('#comp-21 h2:nth-child(2)').innerHTML = getHours('2021-activities').toFixed(0).toString(10) + 'H';
const bestMonthElem = document.querySelector(`#calendrier div:nth-child(${bestMonthId + 1})`);
bestMonthElem.classList.add("best-month");
bestMonthElem.insertAdjacentHTML("beforeend", `<p>${hoursByMonth[bestMonthId].toFixed(0)}H</p>`)
for(let i = 0; i < 12; i++){
    const scale = (hoursByMonth[i] / hoursByMonth[bestMonthId]) * 1.5;

    console.log(hoursByMonth[i].toFixed(0), hoursByMonth[bestMonthId].toFixed(0), scale.toFixed(3));
    document.querySelector(`#calendrier div:nth-child(${i + 1})`).style.transform = `scale(${scale})`;
}