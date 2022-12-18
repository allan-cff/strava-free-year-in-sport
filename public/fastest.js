function getFastestRide(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    return activities.reduce((fastest, current) => {
        if(fastest === null || fastest.type !== "Ride"){
            if(current.type === "Ride"){
                return current;
            }
            return null;
        }
        if(current.type !== "Ride"){
            return fastest;
        }
        if(current.average_speed > fastest.average_speed){
            return current;
        }
        return fastest;
    });
}

function getFastestRun(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    return activities.reduce((fastest, current) => {
        if(fastest === null || fastest.type !== "Run"){
            if(current.type === "Run"){
                return current;
            }
            return null;
        }
        if(current.type !== "Run"){
            return fastest;
        }
        if(current.average_speed > fastest.average_speed){
            return current;
        }
        return fastest;
    });
}

function getBiggestClimbRide(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    return activities.reduce((longuest, current) => {
        if(longuest === null || longuest.type !== "Ride"){
            if(current.type === "Ride"){
                return current;
            }
            return null;
        }
        if(current.type !== "Ride"){
            return longuest;
        }
        if(current.distance > longuest.distance){
            return current;
        }
        return longuest;
    });
}

function getBiggestClimbRun(){
    const activities = JSON.parse(localStorage.getItem('activities'));
    return activities.reduce((longuest, current) => {
        if(longuest === null || longuest.type !== "Run"){
            if(current.type === "Run"){
                return current;
            }
            return null;
        }
        if(current.type !== "Run"){
            return longuest;
        }
        if(current.distance > longuest.distance){
            return current;
        }
        return longuest;
    });
}

console.log(getFastestRide());
console.log(getFastestRun());
console.log(getBiggestClimbRide());
console.log(getBiggestClimbRun());
