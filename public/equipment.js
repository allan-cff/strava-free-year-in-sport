function getBestEquipment(sportType, storedAs = 'equipments'){
    const equipments = JSON.parse(localStorage.getItem(storedAs));
    sportType = sportType.toLowerCase();
    const best = Object.values(equipments).reduce((maxValue, currentValue) => {
        if(currentValue.sport === sportType && maxValue.sport !== sportType){
            return currentValue;
        }
        if(currentValue.sport === sportType && maxValue.sport === sportType){
            if(currentValue.hours > maxValue.hours){
                return currentValue;
            }    
            return maxValue;
        }
        return maxValue;
    })
    if(best.sport !== sportType){
        return null;
    }
    return best;
}

function getTotals(){
    return JSON.parse(localStorage.getItem('totals'));
}

function getActivity(id, storedAs='activities'){
    return JSON.parse(localStorage.getItem(storedAs)).find(act => act.id === id);
}

function parseSeconds(seconds){
    const hours = (seconds/60/60).toFixed(0);
    seconds -= hours*60*60;
    const minutes = (seconds/60).toFixed(0);
    seconds -= minutes*60;
    if(hours > 0){
        return hours + ':' + minutes + ':' + seconds;
    } else {
        return minutes + ':' + seconds;
    }
}

const totals = getTotals();
const bestRideEquipment = getBestEquipment('ride');
if(bestRideEquipment !== null){
    const bestBike = JSON.parse(localStorage.getItem(bestRideEquipment.id));
    document.querySelector('#velo .nom').innerHTML = bestBike.name;
    document.querySelector('#velo .modele').innerHTML = bestBike.brand_name + ' ' + bestBike.model_name;
    document.querySelector('#velo .nb-km').innerHTML = (bestBike.year_distance/1000).toFixed(0);
    document.querySelector('#velo .heures').innerHTML = `Vous avez passé ${bestBike.year_hours.toFixed(0)}h en compagnie de ${bestBike.nickname}`;
}

const bestRunEquipment = getBestEquipment('run');
if(bestRunEquipment !== null){
    const bestShoes = JSON.parse(localStorage.getItem(bestRunEquipment.id));
    document.querySelector('#cap .nom').innerHTML = bestShoes.name;
    document.querySelector('#cap .modele').innerHTML = bestShoes.brand_name + ' ' + bestShoes.model_name;
    document.querySelector('#cap .nb-km').innerHTML = (bestShoes.year_distance/1000).toFixed(0);
    document.querySelector('#cap .heures').innerHTML = `Vous avez passé ${bestShoes.year_hours.toFixed(0)}h en compagnie de ${bestShoes.nickname}`;
}
if(totals.heartrate.count > 0){
    document.querySelector('#fc .nombre-sm').innerHTML = (totals.heartrate.total / totals.heartrate.count).toFixed(1);
    const maxHeartrateActivity = getActivity(totals.heartrate.maxId);
    document.querySelector('#max #sortie-max p:nth-child(1)').innerHTML = maxHeartrateActivity.name;
    document.querySelector('#max #sortie-max p:nth-child(2)').innerHTML = `${new Date(maxHeartrateActivity.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} | ${(maxHeartrateActivity.distance/1000).toFixed(2)}km | ${parseSeconds(maxHeartrateActivity.moving_time)}`;
}    