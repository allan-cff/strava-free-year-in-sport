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

const user = JSON.parse(localStorage.getItem('user'));
const totals = JSON.parse(localStorage.getItem('totals'));
document.querySelector('body main .profil .pp-strava').src = user.profile;
document.querySelector('body main .profil .nom').innerHTML = user.lastname;
document.querySelector('body main .profil .prenom').innerHTML = user.firstname;
document.querySelector('.nombre-xl').innerHTML = getNbDaysActive();
document.querySelector('.denivele .nombre-md').innerHTML = totals.total.climb.toFixed(0);
document.querySelector('.distance .nombre-md').innerHTML = (totals.total.distance/1000).toFixed(0);


if(totals.run.hours > totals.ride.hours && totals.run.hours > totals.swim.hours){
    document.querySelector('.top-sport img').src = './images/run-white.svg';
    document.querySelector('.top-sport img').alt = 'Course à pieds';
}

if(totals.ride.hours > totals.run.hours && totals.ride.hours > totals.swim.hours){
    document.querySelector('.top-sport img').src = './images/bike-white.svg';
    document.querySelector('.top-sport img').alt = 'Cyclisme';
}