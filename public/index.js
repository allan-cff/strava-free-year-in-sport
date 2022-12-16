document.querySelector('body #accountAuthButton').addEventListener('click', () => {
    let url = new URL(window.location.href);
    if(url.searchParams.get("code")){
        console.log("Authenticated user");
        const code = url.searchParams.get("code");
        fetch(`/token?code=${code}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => {
                response.json()
                    .then(res => {
                        console.log(res);
                    });
            }
        )
    } else {
        window.location.href = "https://www.strava.com/oauth/authorize?client_id=56606&redirect_uri=http://localhost:8080&response_type=code&scope=read_all,profile:read_all,activity:read_all";
    }
})