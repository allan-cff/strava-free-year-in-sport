function getNbDaysActive(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    const daysActive = [];
    let nbDaysActive = 0;
    for(let i = 0; i < 12; i++){
        daysActive.push([]);
    }
    for(const activity of activities){
        const actDate = new Date(activity.start_date_local);
        if(!(daysActive[actDate.getMonth()].find(date => date === actDate.getDate()))){
            daysActive[actDate.getMonth()].push(actDate.getDate());
            nbDaysActive++
        }
    }
    return nbDaysActive;
}

function setIcon(selector, activityType, alt){
    const icons = JSON.parse(localStorage.getItem('sport-icons'));
    fetch(icons[activityType])
    .then(response => response.text())
    .then(text => {
        document.querySelector(selector).insertAdjacentHTML('afterbegin', text);
        document.querySelector(selector + " svg").alt = alt;
    });
}

const user = JSON.parse(localStorage.getItem('user'));
const totals = JSON.parse(localStorage.getItem('totals'));
const languages = JSON.parse(localStorage.getItem('sport-languages'));
const sportsArray = Object.keys(totals).filter(sport => sport !== "total" && sport !== "heartrate");
sportsArray.sort((a, b) => totals[b].hours - totals[a].hours);

document.querySelector('body main .profil .pp-strava').src = user.profile;
document.querySelector('body main .profil .nom').innerHTML = user.lastname;
document.querySelector('body main .profil .prenom').innerHTML = user.firstname;
document.querySelector('.nombre-xl').innerHTML = getNbDaysActive();
document.querySelector('.denivele .nombre-md').innerHTML = totals.total.climb.toFixed(0);
document.querySelector('.distance .nombre-md').innerHTML = (totals.total.distance/1000).toFixed(0);
document.querySelector('.heures .nombre-md').innerHTML = (totals.total.hours).toFixed(0);

setIcon('.top-sport', sportsArray[0], languages.fr[sportsArray[0]] || sportsArray[0])