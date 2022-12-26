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

numberAnimation('.record .medaille .nombre-sm', getPRNumber());