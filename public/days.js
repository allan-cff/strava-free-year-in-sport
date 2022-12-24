function getDaysActive(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    const daysActive = [];
    for(let i = 0; i < 12; i++){
        daysActive.push([]);
    }
    for(const activity of activities){
        const actDate = new Date(activity.start_date_local);
        if(!(daysActive[actDate.getMonth()].find(date => date === actDate.getDate()))){
            daysActive[actDate.getMonth()].push(actDate.getDate());
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

function getSrc(sport){
    if(sport === 'MountainBikeRide' || sport === 'Ride'){
        return './images/bike-black.svg';
    }
    if(sport === 'Run' || sport === 'Hike'){
        return './images/run-black.svg'
    }
}

const sportPercentage = getSportPercentage();
const daysActive = getDaysActive();

document.querySelector(`.nombre-xl`).innerHTML = daysActive.reduce((sum, current) => sum + current.length, 0);

const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let streak = 0;
let maxStreak = 0;
for(let i = 0; i < 12; i++){
    const monthDiv = document.querySelector(`body main .calendrier #${months[i]} .jours`);
    for(let day = 1; day <= daysInMonth[i]; day++){
        if(daysActive[i].find(date => date === day)){
            monthDiv.insertAdjacentHTML('beforeend', '<div class="jour-actif"></div>');
            streak++;
            if(streak > maxStreak){
                maxStreak = streak;
            }
        } else {
            monthDiv.insertAdjacentHTML('beforeend', '<div class="jour-inactif"></div>');
            streak = 0;
        }
    }
}

document.querySelector('.streak>p').innerHTML = maxStreak;

for(let i = 1; i < 5; i++){
    let maxPercentage = 0;
    let maxPercentageSport = "";
    for(const [key, value] of Object.entries(sportPercentage)){
        if(value > maxPercentage){
            maxPercentage = value;
            maxPercentageSport = key;
        }
    }
    document.querySelector(`body main .top-sport #top-${i} p`).innerHTML = `${(maxPercentage*100).toFixed(0)}%<br>${maxPercentageSport}`;
    document.querySelector(`body main .top-sport #top-${i} img`).src = getSrc(maxPercentageSport);
    document.querySelector(`body main .top-sport #top-${i} img`).alt = maxPercentageSport;
    delete sportPercentage[maxPercentageSport];
}