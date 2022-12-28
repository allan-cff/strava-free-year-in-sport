fetch('/appid', {
        method: 'GET'
    }).then(response => {
            response.json().then(res => {
                document.querySelector('body a#accountAuthButton').href = `https://www.strava.com/oauth/authorize?client_id=${res}&redirect_uri=http://localhost:8080&response_type=code&scope=read_all,profile:read_all,activity:read_all`;
            });
        }
    )

document.querySelector('#conditions').addEventListener('click', () => {
    document.querySelector('#accountAuthButton').style.visibility = "visible"
})    