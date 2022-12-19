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

function getUserProfile(){
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

function getUserActivities(startDate, endDate, options={storeAs : 'activities', page : 1}){
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
                for(const activity of res){
                    if(!(prevRes.find(a => a.id === activity.id))){  // checking for no doubles (page refresh for example)
                        prevRes.push(activity);
                    }
                }
                localStorage.setItem(options.storeAs, JSON.stringify(prevRes));
                if(res.length === 30){
                    options.page = options.page + 1;
                    getUserActivities(startDate, endDate, options); // Default per page results is 30 => run for next page
                }
            });
        }
    )
}

function getAthleteStats(){
    const token = sessionStorage.getItem('user_token');
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`https://www.strava.com/api/v3/athletes/${user.id}/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }).then(response => {
            response.json().then(res => {
                localStorage.setItem('athlete', JSON.stringify(res));
            });
        }
    )
}

main().then(() => {
    getUserProfile();
    localStorage.setItem('activities', JSON.stringify([]));
    getUserActivities(Date.parse("2022-01-01T00:00:00.000"), Date.now());
    localStorage.setItem('2021-activities', JSON.stringify([]));
    getUserActivities(Date.parse("2021-01-01T00:00:00.000"), Date.parse("2022-01-01T00:00:00.000"), {storeAs : '2021-activities'});
});