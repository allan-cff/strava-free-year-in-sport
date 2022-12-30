function getTotals(){
    return JSON.parse(localStorage.getItem('totals'));
}

function getPRNumber(){
    const totals = getTotals();
    return totals.total.pr;
}

function getKudosNumber(){
    const totals = getTotals();
    return totals.total.kudos;
}

function setValue(elem, value){
    elem.innerHTML = value;
}

function numberAnimation(selector, value, duration = 3){
    const elem = document.querySelector(selector);
    elem.innerHTML = 0;
    for(let i = 0; i <= value; i++){
        setTimeout(setValue, (i/value)*(duration*1000), elem, i);
    }
}

console.log(getPRNumber());
console.log(getKudosNumber());
const totals = getTotals()

numberAnimation('.record .medaille .nombre-sm', getPRNumber());
document.querySelector("#kudos .nombre-md").innerHTML = totals.total.kudos;
const mostKudoed = JSON.parse(localStorage.getItem('activities')).find(a => a.id === parseInt(localStorage.getItem('most-kudoed'), 10));
document.querySelector('#kudos #most-kudoed .nombre-md').innerHTML = mostKudoed.kudos_count;
document.querySelector('#kudos #most-kudoed .texte-kudos').innerHTML = mostKudoed.name;
document.querySelector('#everest .nombre-md').innerHTML = (totals.total.climb/8848).toFixed(1);