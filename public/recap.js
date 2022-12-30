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
document.querySelector('.heures .nombre-md').innerHTML = (totals.total.hours).toFixed(0);


if(totals.run.hours > totals.ride.hours && totals.run.hours > totals.swim.hours){
    fetch('images/sports/bike.svg')
        .then(response => response.text())
        .then(text => {
            document.querySelector('.top-sport h2').insertAdjacentHTML("beforeend", text)
            document.querySelector('.top-sport svg').alt = 'Course à pieds';
        })
    document.querySelector('.top-sport svg').src = './images/run-white.svg';
    document.querySelector('.top-sport svg').alt = 'Course à pieds';
}

if(totals.ride.hours > totals.run.hours && totals.ride.hours > totals.swim.hours){
    fetch('images/sports/bike.svg')
        .then(response => response.text())
        .then(text => {
            document.querySelector('.top-sport h2').insertAdjacentHTML("beforeend", text)
            document.querySelector('.top-sport svg').alt = 'Cyclisme';
        })
}