async function main() {
    if(sessionStorage.getItem('user_token') !== null){ // If we have a token, user already accepted oauth
        const token = sessionStorage.getItem('user_token');
        const expires = sessionStorage.getItem('token_expires')
        if(Date.now() - 30*60*1000 < expires){ // If token expired, refreshes it
            await refreshToken(token);
        }
    } else {
        const url = new URL(window.location.href); // If there is code in the url, the user just authorized from oauth page
        if(url.searchParams.get("code")){
            const code = url.searchParams.get("code");
            await getUserToken(code);
        } else {
            window.location.pathname = '/login.html'; // If none of these conditions, redirect to login page
        }
    }
}

async function refreshToken(token){
    const response = await fetch(`/refresh?userId=${userId}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });
    const res = await response.json();
    sessionStorage.setItem('user_token', res.token);
    sessionStorage.setItem('token_expires', res.expires);
}

async function getUserToken(code){
    const response = await fetch(`/token?code=${code}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });
    const res = await response.json();
    sessionStorage.setItem('user_token', res.token);
    sessionStorage.setItem('token_expires', res.expires);
}

async function getUserProfile(){
    const token = sessionStorage.getItem('user_token');
    fetch('https://www.strava.com/api/v3/athlete', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }).then(response => {
            response.json().then(res => {
                localStorage.setItem('user', JSON.stringify(res));
            });
        }
    )
}

async function getUserActivities(startDate, endDate, options={storeAs : 'activities', page : 1}){
    options.storeAs = options.storeAs || 'activities';
    options.page = options.page || 1;
    const token = sessionStorage.getItem('user_token');
    fetch(`https://www.strava.com/api/v3/athlete/activities?before=${endDate/1000}&after=${startDate/1000}&page=${options.page}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }).then(response => {
            response.json().then(res => {
                let prevRes = JSON.parse(localStorage.getItem(options.storeAs));
                alreadyCached = false;
                for(const activity of res){
                    if(!(prevRes.find(a => a.id === activity.id))){  // checking for no doubles (page refresh for example)
                        prevRes.push(activity);
                    } else {
                        alreadyCached = true;
                    }
                }
                localStorage.setItem(options.storeAs, JSON.stringify(prevRes));
                if(res.length === 30 && !alreadyCached){
                    options.page = options.page + 1;
                    getUserActivities(startDate, endDate, options); // Default per page results is 30 => run for next page
                }
            });
        }
    )
}

function getDetailledActivity(id){
    if(localStorage.getItem(id)){
        return JSON.parse(localStorage.getItem(id));
    }
    const token = sessionStorage.getItem('user_token');
    fetch(`https://www.strava.com/api/v3/activities/${id}?include_all_efforts=true`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }).then(response => {
            response.json().then(res => {
                localStorage.setItem(id.toString(10), JSON.stringify(res));
            });
        }
    )
}

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

function getMostKudoedPicturesActivityId(storedAs='activities', limit=4, pictureByActivity=1){
    const activities = sortByKudos(storedAs);
    let counter = 0;
    const result = [];
    for(const activity of activities){
        if(activity.total_photo_count > 0 && counter < limit){
            counter += Math.min(activity.total_photo_count, pictureByActivity);
            result.push(activity.id);
            console.log('id ', activity.id, 'pictures : ', activity.total_photo_count, 'counter : ', counter);
        }
        if(counter >= limit){
            break;
        }
    }
    return result;
}

main().then(async () => {
    if(localStorage.getItem('activities') === null){
        localStorage.setItem('activities', JSON.stringify([]));
    }
    if(localStorage.getItem('2021-activities') === null){
        localStorage.setItem('2021-activities', JSON.stringify([]));
    }

    console.log('Getting user profile');
    await getUserProfile();

    console.log('Getting user 2022 activities');
    await getUserActivities(Date.parse("2022-01-01T00:00:00.000"), Date.now());

    console.log('Getting user 2021 activities');
    getUserActivities(Date.parse("2021-01-01T00:00:00.000"), Date.parse("2022-01-01T00:00:00.000"), {storeAs : '2021-activities'});
    
    const bestPicturesActivitiesId = getMostKudoedPicturesActivityId();
    localStorage.setItem('best_pictures', JSON.stringify(bestPicturesActivitiesId));
    
    console.log('Getting user detailled activities');
    for(const id of bestPicturesActivitiesId){
        getDetailledActivity(id);
    }
});