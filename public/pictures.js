const bestPicturesActivitiesId = JSON.parse(localStorage.getItem('best_pictures'));
const bestPicturesActivitiesObjects = bestPicturesActivitiesId.map(id => JSON.parse(localStorage.getItem(id)));
console.log(bestPicturesActivitiesObjects);
let i = 0;
let ids = ['premier', 'deuxieme', 'troisieme', 'quatrieme'];
for(const activity of bestPicturesActivitiesObjects){
    document.querySelector(`.meilleures-photos #${ids[i]} img`).src = activity.photos.primary.urls[600];
    document.querySelector(`.meilleures-photos #${ids[i]} img`).alt = activity.name;
    document.querySelector(`.meilleures-photos #${ids[i]} .pictures-info .pictures-nom p`).innerHTML = activity.name;
    document.querySelector(`.meilleures-photos #${ids[i]} .pictures-info .pictures-horaires p:nth-child(1)`).innerHTML = new Date(activity.start_date_local).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    document.querySelector(`.meilleures-photos #${ids[i]} .pictures-info .pictures-horaires p:nth-child(2)`).innerHTML = new Date(activity.start_date_local).toLocaleTimeString();
    i++;
}