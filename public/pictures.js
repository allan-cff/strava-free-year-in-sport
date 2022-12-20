function sortByKudos(storedAs='activities'){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    activities.sort((a, b) => {
        if(b.kudos_count === a.kudos_count){
            return b.comment_count - a.comment_count;
        }
        return b.kudos_count - a.kudos_count;
    });
    return activities;
}

function getMostKudoedPictures(storedAs='activities', limit=3){
    const activities = sortByKudos(storedAs);
    let counter = 0;
    const result = [];
    for(const activity of activities){
        if(activity.total_photo_count > 0){
            counter += activity.total_photo_count;
            result.push(activity);
        }
        if(counter >= limit){
            break;
        }
    }
    return result;
}

console.log(sortByKudos());
console.log(getMostKudoedPictures());