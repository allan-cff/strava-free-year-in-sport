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