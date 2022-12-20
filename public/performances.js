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

console.log(getPRNumber());
console.log(getKudosNumber());