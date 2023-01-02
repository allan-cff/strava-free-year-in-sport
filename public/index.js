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

function tooManyRequests(){
    const date = new Date();
    if(date.getMinutes() < 15){
        date.setMinutes(15);
    } else if(date.getMinutes() < 30){
        date.setMinutes(30);
    } else if(date.getMinutes() < 45){
        date.setMinutes(45);
    } else {
        date.setMinutes(0);
        date.setHours(date.getHours() + 1);
    }
    window.alert(`Number of requests allowed by Strava exceeded. Please wait until ${date.toLocaleTimeString()} in ${date - Date.now()}ms`);
    setTimeout(() => location.reload(), date - Date.now())
}

async function refreshToken(){
    const user = JSON.parse(localStorage.getItem('user'));
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
        if(response.status === 429){
            console.log(response);
            tooManyRequests();
        }
        if(response.status === 200){
            response.json().then(res => {
                localStorage.setItem('user', JSON.stringify(res));
                console.log('Successfully got user profile');
            });
        }
    });
}

async function getUserActivities(startDate, endDate, options={storeAs : 'activities', page : 1, checkingCacheFromLast : false}){
    options.storeAs = options.storeAs || 'activities';
    options.page = options.page || 1;
    options.checkingCacheFromLast = options.checkingCacheFromLast || false;
    console.log('Getting user activities stocked as ', options.storeAs, ' page ', options.page);
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
    if(response.status === 429){
        console.log(response);
        tooManyRequests();
    }
    if(response.status === 200){
        const res = await response.json();
        let prevRes = JSON.parse(localStorage.getItem(options.storeAs));
        let alreadyCached;
        if(!options.checkingCacheFromLast){
            alreadyCached = false;
            for(const activity of res){
                if(!(prevRes.find(a => a.id === activity.id))){  // checking for no doubles (page refresh for example)
                    prevRes.push(activity);
                } else {
                    alreadyCached = true;
                }
            }
        } else {
            alreadyCached = true;
            for(const activity of res){
                if(!(prevRes.find(a => a.id === activity.id))){  // checking for no doubles (page refresh for example)
                    prevRes.push(activity);
                    alreadyCached = false;
                }    
            }
        }
        localStorage.setItem(options.storeAs, JSON.stringify(prevRes));
        if(res.length === 30 && !alreadyCached && !options.checkingCacheFromLast){
            options.page = options.page + 1;
            await getUserActivities(startDate, endDate, options); // Default per page results is 30 => run for next page
        }
        if(options.page === 1 && alreadyCached){
            if(prevRes.length % 30 === 0){
                options.page = Math.round(prevRes.length / 30) + 1;
            } else {
                options.page = Math.round(prevRes.length / 30);
            }
            options.checkingCacheFromLast = true;
            await getUserActivities(startDate, endDate, options); // Checking if all activities from last page are cached too
        }
        if(options.checkingCacheFromLast && !alreadyCached){
            localStorage.setItem(options.storeAs, JSON.stringify([]));
            options.checkingCacheFromLast = false;
            options.page = 1;
            await getUserActivities(startDate, endDate, options);
        }
        console.log('Successfully got user activities stocked as ', options.storeAs);
    }    
}

async function getDetailledActivity(id){
    console.log('Getting detailled activity ', id);
    if(localStorage.getItem(id)){
        console.log('Successfully got detailled activity ', id);
        return;
    }
    const token = sessionStorage.getItem('user_token');
    const response = await fetch(`https://www.strava.com/api/v3/activities/${id}?include_all_efforts=true`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    });
    if(response.status === 401){
        console.log(response);
        checkCredentials();
    }
    if(response.status === 429){
        console.log(response);
        tooManyRequests();
    }
    if(response.status === 200){
        const res = await response.json();
        localStorage.setItem(id.toString(10), JSON.stringify(res));
        console.log('Successfully got detailled activity ', id);
    }
}

async function getDetailledEquipment(equipment){
    console.log('Getting detailled equipment ', equipment.id);
    const token = sessionStorage.getItem('user_token');
    const response = await fetch(`https://www.strava.com/api/v3/gear/${equipment.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    });
    if(response.status === 401){
        console.log(response);
        checkCredentials();
    }
    if(response.status === 429){
        console.log(response);
        tooManyRequests();
    }
    if(response.status === 200){
        const res = await response.json();
        console.log(res);
        localStorage.setItem(equipment.id, JSON.stringify(Object.assign(equipment, res)));
        console.log('Successfully got detailled equipment ', equipment.id);
    }
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

function getMostKudoed(storedAs='activities'){
    return sortByKudos(storedAs)[0].id;
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
        heartrate : {
            total : 0,
            count : 0,
            max : 0,
            maxId : undefined
        }
    };
    const activities = JSON.parse(localStorage.getItem(storedAs));
    for(const activity of activities){
        if('total_elevation_gain' in activity){
            totals.total.climb += activity.total_elevation_gain;
        }
        if('distance' in activity){
            totals.total.distance += activity.distance;
        }
        if('moving_time' in activity){
            totals.total.hours += activity.moving_time/60/60;
        }
        totals.total.pr += activity.pr_count;
        totals.total.kudos += activity.kudos_count;
        totals.total.count += 1;
        if("average_heartrate" in activity){
            totals.heartrate.count += 1;
            totals.heartrate.total += activity.average_heartrate;
            if(activity.average_heartrate > totals.heartrate.max){
                totals.heartrate.max = activity.average_heartrate;
                totals.heartrate.maxId = activity.id;
            }
        }
        const type = activity.type;
        if(!(type in totals)){
            totals[type] = {};
            if('total_elevation_gain' in activity){
                totals[type].climb = activity.total_elevation_gain;
            }
            if('distance' in activity){
                totals[type].distance = activity.distance;
            }
            if('moving_time' in activity){
                totals[type].hours = activity.moving_time/60/60;
            }
            totals[type].pr = activity.pr_count;
            totals[type].kudos = activity.kudos_count;
            totals[type].count = 1;
        } else {
            if('total_elevation_gain' in activity){
                totals[type].climb += activity.total_elevation_gain;
            }
            if('distance' in activity){
                totals[type].distance += activity.distance;
            }
            if('moving_time' in activity){
                totals[type].hours += activity.moving_time/60/60;
            }
            totals[type].pr += activity.pr_count;
            totals[type].kudos += activity.kudos_count;
            totals[type].count += 1;
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

function getEquipments(storedAs = 'activities', storeAs = 'equipments'){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    const equipments = {};
    for(const activity of activities){
        if(activity.gear_id !== null){
            if(activity.gear_id in equipments){
                equipments[activity.gear_id].year_hours += activity.moving_time/60/60;
                equipments[activity.gear_id].year_count += 1;
                equipments[activity.gear_id].year_distance += activity.distance;
            } else {
                equipments[activity.gear_id] = {
                    "sport" : activity.type.toLowerCase(),
                    "year_hours" : activity.moving_time/60/60,
                    "year_count" : 1,
                    "year_distance" : activity.distance,
                    "id" : activity.gear_id
                }
            }
        }
    }
    localStorage.setItem(storeAs, JSON.stringify(equipments));
}

function getBestEquipment(sportType, storedAs = 'equipments'){
    const equipments = JSON.parse(localStorage.getItem(storedAs));
    sportType = sportType.toLowerCase();
    const best = Object.values(equipments).reduce((maxValue, currentValue) => {
        if(maxValue === null || maxValue.sport !== sportType){
            if(currentValue.sport === sportType){
                console.log("Selecting ", currentValue.id, " as first ", sportType);
                return currentValue;
            }
            return null;
        }
        if(currentValue.sport !== sportType){
            return maxValue;
        }
        if(currentValue.year_hours > maxValue.year_hours){
            console.log("Replacing with ", currentValue.id, " having more hours than ", maxValue.id);
            return currentValue;
        }
        return maxValue;
    })
    return best;
}

function getSportsDuration(storedAs='activities', storeAs='sport-duration'){
    const activities = JSON.parse(localStorage.getItem(storedAs));
    const sportDuration = {};
    for(const activity of activities){
        if(sportDuration[activity.sport_type] === undefined){
            sportDuration[activity.sport_type] = activity.moving_time;
        } else {
            sportDuration[activity.sport_type] += activity.moving_time;
        }
    }
    localStorage.setItem(storeAs, JSON.stringify(sportDuration));
}

function dataReady(){
    document.querySelector('.loading').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('.ready').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.ready').style.opacity = 1;
            document.querySelector('.ready a').href = 'landing.html'
        }, 250);
    }, 250);
}

localStorage.setItem('sport-icons', JSON.stringify({
    AlpineSki: '/images/sports/ski.svg',
    BackcountrySki: '/images/sports/ski.svg',
    Canoeing: '/images/sports/canoe.svg',
    Crossfit: '/images/sports/crossfit.svg',
    EBikeRide: '/images/sports/elec-bike.svg',
    Elliptical: '/images/sports/bike.svg',
    EMountainBikeRide: '/images/sports/elec-bike.svg',
    Golf: '/images/sports/golf.svg',
    GravelRide: '/images/sports/bike.svg',
    Handcycle: '/images/sports/handbike.svg',
    Hike: '/images/sports/hiking.svg',
    IceSkate: '/images/sports/ice-skating.svg',
    InlineSkate: '/images/sports/roller-blading.svg',
    Kayaking: '/images/sports/canoe.svg',
    Kitesurf: '/images/sports/kitesurf.svg',
    MountainBikeRide: '/images/sports/bike.svg',
    NordicSki: '/images/sports/ski.svg',
    Ride: '/images/sports/bike.svg',
    RockClimbing: '/images/sports/climb.svg',
    RollerSki: '/images/sports/ski.svg',
    Rowing: '/images/sports/rowing.svg',
    Run: '/images/sports/run.svg',
    Sail: '/images/sports/sail.svg',
    Skateboard: '/images/sports/skateboard.svg',
    Snowboard: '/images/sports/snowboard.svg',
    Snowshoe: '/images/sports/snowshoes.svg',
    Soccer: '/images/sports/soccer.svg',
    StairStepper: '/images/sports/stairs.svg',
    StandUpPaddling: '/images/sports/paddle.svg',
    Surfing: '/images/sports/surf.svg',
    Swim: '/images/sports/swim.svg',
    TrailRun: '/images/sports/run.svg',
    Velomobile: '/images/sports/mobile-bike.svg',
    VirtualRide: '/images/sports/bike.svg',
    VirtualRun: '/images/sports/run.svg',
    Walk: '/images/sports/walk.svg',
    WeightTraining: '/images/sports/workout.svg',
    Wheelchair: '/images/sports/wheelchair.svg',
    Windsurf: '/images/sports/surf.svg',
    Workout: '/images/sports/workout.svg',
    Yoga: '/images/sports/yoga.svg'
}));

localStorage.setItem('sport-languages', JSON.stringify({
    "fr": {
        "Ride" : "Cyclisme",
        "MountainBikeRide" : "VTT",
        "Run" : "Course",
        "Hike" : "Randonnée",
        "Swim" : "Natation"
    }
}));

async function waitForProgress(asyncCall, progressSelector, progressAdvance){
    await asyncCall;
    const progress = document.querySelector(progressSelector);
    progress.value = parseInt(progress.value, 10) + progressAdvance;
    if(progress.value === 100){
        setTimeout(dataReady, 300);
    }
}

document.querySelector('.reload a').addEventListener('click', () => {
    localStorage.removeItem('activities')
    localStorage.removeItem('2021-activities')
    localStorage.removeItem('totals')
    localStorage.removeItem('2021-totals')
    localStorage.removeItem('most-kudoed')
    localStorage.removeItem('user')
    localStorage.removeItem('best_pictures')
    localStorage.removeItem('equipments')
    localStorage.removeItem('sport-duration')
    location.reload();
});

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

        getUserActivities(Date.parse("2022-01-01T00:00:00.000"), Date.parse("2023-01-01T00:00:00.000"))
            .then(() => {
                progress.value = parseInt(progress.value, 10) + 30;
                console.log(progress.value);
                const bestPicturesActivitiesId = getMostKudoedPicturesActivityId();
                localStorage.setItem('best_pictures', JSON.stringify(bestPicturesActivitiesId));
                
                for(const id of bestPicturesActivitiesId){
                    waitForProgress(getDetailledActivity(id), 'progress', 5)
                }
                progress.value = parseInt(progress.value, 10) + (4-bestPicturesActivitiesId.length)*5;
            
                getTotals();

                localStorage.setItem('most-kudoed', getMostKudoed());

                getSportsDuration();
                getEquipments();
                const bestBike = getBestEquipment('ride');
                const bestShoes = getBestEquipment('run');
                
                if(bestBike !== null){
                    waitForProgress(getDetailledEquipment(bestBike), 'progress', 5)
                } else {
                    progress.value = parseInt(progress.value, 10) + 5;
                }
                if(bestShoes !== null){
                    waitForProgress(getDetailledEquipment(bestShoes), 'progress', 5)
                } else {
                    progress.value = parseInt(progress.value, 10) + 5;
                }
                if(progress.value === 100){
                    setTimeout(dataReady, 300);
                }
            });

        getUserActivities(Date.parse("2021-01-01T00:00:00.000"), Date.parse("2022-01-01T00:00:00.000"), {storeAs : '2021-activities'})
            .then(() => {
                progress.value = parseInt(progress.value, 10) + 30;
                console.log(progress.value);
                getTotals('2021-activities', '2021-totals');
                if(progress.value === 100){
                    setTimeout(dataReady, 300);
                }
            });
                
    });