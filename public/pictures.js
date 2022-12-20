const bestPicturesActivitiesId = JSON.parse(localStorage.getItem('best_pictures'));
const bestPicturesActivitiesObjects = bestPicturesActivitiesId.map(id => JSON.parse(localStorage.getItem(id)));
console.log(bestPicturesActivitiesObjects);
let i = 1;
for(const activity of bestPicturesActivitiesObjects){
    document.querySelector(`img#img${i}`).src = activity.photos.primary.urls[600];
    i++;
}