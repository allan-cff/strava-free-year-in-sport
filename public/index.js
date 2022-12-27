async function checkCredentials() {
    if(sessionStorage.getItem('user_token') !== null){ // If we have a token, user already accepted oauth
        const token = sessionStorage.getItem('user_token');
        const expires = sessionStorage.getItem('token_expires');
        if(Date.now() > expires - 60*60*1000){ // If token expired, refreshes it
            await refreshToken();
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

async function refreshToken(){
    const user = localStorage.getItem('user');
    const userId = user.id;
    const response = await fetch(`/refresh?userId=${userId}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });
    const res = await response.json();
    sessionStorage.setItem('user_token', res.token);
    sessionStorage.setItem('token_expires', res.expires*1000);
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
    sessionStorage.setItem('token_expires', res.expires*1000);
}

async function getUserProfile(){
    console.log('Getting user profile');
    const token = sessionStorage.getItem('user_token');
    fetch('https://www.strava.com/api/v3/athlete', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }).then(response => {
        if(response.status === 401){
            console.log(response);
            checkCredentials();
        }
        if(response.status === 200){
            response.json().then(res => {
                localStorage.setItem('user', JSON.stringify(res));
                console.log('Successfully got user profile');
            });
        }
    });
}

async function getUserActivities(startDate, endDate, options={storeAs : 'activities', page : 1}){
    options.storeAs = options.storeAs || 'activities';
    options.page = options.page || 1;
    console.log('Getting user activities stocked as ', options.storeAs);
    const token = sessionStorage.getItem('user_token');
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?before=${endDate/1000}&after=${startDate/1000}&page=${options.page}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    });
    if(response.status === 401){
        console.log(response);
        checkCredentials();
    }
    if(response.status === 200){
        const res = await response.json();
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
            await getUserActivities(startDate, endDate, options); // Default per page results is 30 => run for next page
        }
        console.log('Successfully got user activities stocked as ', options.storeAs);
    }    
}

async function getDetailledActivity(id){
    console.log('Getting detailled activity ', id);
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
        if(response.status === 401){
            console.log(response);
            checkCredentials();
        }
        if(response.status === 200){
            response.json().then(res => {
                localStorage.setItem(id.toString(10), JSON.stringify(res));
                console.log('Successfully got detailled activity ', id);
            });
        }    
    });
}

function sortByKudos(storedAs='activities'){
    console.log('Sorting by kudo');
    const activities = JSON.parse(localStorage.getItem(storedAs));
    activities.sort((a, b) => {
        if(b.kudos_count === a.kudos_count){
            return b.comment_count - a.comment_count;
        }
        return b.kudos_count - a.kudos_count;
    });
    return activities;
}

function getTotals(storedAs = 'activities', storeAs = 'totals'){
    console.log('Counting Totals');
    const totals = {
        total : {
            climb : 0,
            distance : 0,
            hours : 0,
            pr: 0,
            kudos : 0,
            count : 0
        },
        ride : {
            climb : 0,
            distance : 0,
            hours : 0,
            pr: 0,
            kudos : 0,
            count : 0
        },
        run : {
            climb : 0,
            distance : 0,
            hours : 0,
            pr: 0,
            kudos : 0,
            count : 0
        },
        hike : {
            climb : 0,
            distance : 0,
            hours : 0,
            pr: 0,
            kudos : 0,
            count : 0
        },
        swim : {
            distance : 0,
            hours : 0,
            pr: 0,
            kudos : 0,
            count : 0
        },
    };
    const activities = JSON.parse(localStorage.getItem(storedAs));
    for(const activity of activities){
        totals.total.climb += activity.total_elevation_gain;
        totals.total.distance += activity.distance;
        totals.total.hours += activity.moving_time/60/60;
        totals.total.pr += activity.pr_count;
        totals.total.kudos += activity.kudos_count;
        totals.total.count += 1;
        switch(activity.type){
            case 'Ride' :
                totals.ride.climb += activity.total_elevation_gain;
                totals.ride.distance += activity.distance;
                totals.ride.hours += activity.moving_time/60/60;
                totals.ride.pr += activity.pr_count;
                totals.ride.kudos += activity.kudos_count;
                totals.ride.count += 1;
                break;
            case 'Run' :
                totals.run.climb += activity.total_elevation_gain;
                totals.run.distance += activity.distance;
                totals.run.hours += activity.moving_time/60/60;
                totals.run.pr += activity.pr_count;
                totals.run.kudos += activity.kudos_count;
                totals.run.count += 1;
                break;
            case 'Swim' :
                totals.swim.distance += activity.distance;
                totals.swim.hours += activity.moving_time/60/60;
                totals.swim.pr += activity.pr_count;
                totals.swim.kudos += activity.kudos_count;
                totals.swim.count += 1;
                break;
            case 'Hike' :
                totals.hike.climb += activity.total_elevation_gain;
                totals.hike.distance += activity.distance;
                totals.hike.hours += activity.moving_time/60/60;
                totals.hike.pr += activity.pr_count;
                totals.hike.kudos += activity.kudos_count;
                totals.hike.count += 1;
                break;          
        }
    }
    localStorage.setItem(storeAs, JSON.stringify(totals))
}

function getMostKudoedPicturesActivityId(storedAs='activities', limit=4, pictureByActivity=1){
    const activities = sortByKudos(storedAs);
    let counter = 0;
    const result = [];
    for(const activity of activities){
        if(activity.total_photo_count > 0 && counter < limit){
            counter += Math.min(activity.total_photo_count, pictureByActivity);
            result.push(activity.id);
        }
        if(counter >= limit){
            break;
        }
    }
    return result;
}

function dataReady(){
    document.querySelector('footer').style.visibility = "visible";
    document.querySelector('body header').style.visibility = "visible";
}

checkCredentials()
    .then(async () => {
        const progress = document.querySelector('progress');
        if(localStorage.getItem('activities') === null){
            localStorage.setItem('activities', JSON.stringify([]));
        }
        if(localStorage.getItem('2021-activities') === null){
            localStorage.setItem('2021-activities', JSON.stringify([]));
        }

        await getUserProfile();
        progress.value = parseInt(progress.value, 10) + 10;
        console.log(progress.value);

        getUserActivities(Date.parse("2022-01-01T00:00:00.000"), Date.now())
            .then(() => {
                progress.value = parseInt(progress.value, 10) + 35;
                console.log(progress.value);
                const bestPicturesActivitiesId = getMostKudoedPicturesActivityId();
                localStorage.setItem('best_pictures', JSON.stringify(bestPicturesActivitiesId));
                
                for(const id of bestPicturesActivitiesId){
                    getDetailledActivity(id);
                }
                progress.value = parseInt(progress.value, 10) + 10;
                console.log(progress.value);
            
                getTotals();
                progress.value = parseInt(progress.value, 10) + 5;
                console.log(progress.value);
                if(progress.value === 100){
                    dataReady();
                }
            });

        getUserActivities(Date.parse("2021-01-01T00:00:00.000"), Date.parse("2022-01-01T00:00:00.000"), {storeAs : '2021-activities'})
            .then(() => {
                progress.value = parseInt(progress.value, 10) + 35;
                console.log(progress.value);
                getTotals('2021-activities', '2021-totals');
                progress.value = parseInt(progress.value, 10) + 5;
                console.log(progress.value);
                if(progress.value === 100){
                    dataReady();
                }
            });
                
    });