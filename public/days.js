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
    const sportDuration = JSON.parse(localStorage.getItem('sport-duration'));
    let yearlyDuration = Object.values(sportDuration).reduce((sum, val) => sum + val, 0);
    for(const [key, value] of Object.entries(sportDuration)){
        console.log(key, value);
        sportDuration[key] = value / yearlyDuration;
    }
    return sportDuration;    
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

const sportPercentage = getSportPercentage();
const daysActive = getDaysActive();

document.querySelector(`.nombre-xl`).innerHTML = daysActive.reduce((sum, current) => sum + current.length, 0);

const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const languages = JSON.parse(localStorage.getItem('sport-languages'))

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
    if(maxPercentage !== 0){
        document.querySelector(`body main .top-sport #top-${i} p`).innerHTML = `${(maxPercentage*100).toFixed(0)}%<br>${languages.fr[maxPercentageSport] || maxPercentageSport}`;
        setIcon(`body main .top-sport #top-${i} .sport-${i}`, maxPercentageSport, languages.fr[maxPercentageSport] || maxPercentageSport)
        delete sportPercentage[maxPercentageSport];
    } else {
        document.querySelector(`body main .top-sport #top-${i}`).remove();
    }
}