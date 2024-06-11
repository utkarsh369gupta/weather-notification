require('dotenv').config();

async function seterror(id, error) {
    let element = document.getElementById(id);
    element.innerHTML = error;
}

async function validation() {
    event.preventDefault();
    let retval = true;
    let farmername = document.getElementById('name').value;
    let farmerphoneno = document.getElementById('phone').value;
    let farmerlocation = document.getElementById('location').value;
    if (farmerphoneno.length != 13) {
        await seterror('phone-error', "Enter Valid Phone no.");
        retval = false;
    }
    if (farmerlocation.trim() === "") {
        await seterror('location-error', "Enter Location");
        retval = false;
    }
    if (farmername.trim() === "") {
        await seterror('name-error', "Enter Name");
        retval = false;
    }
    if (retval) {
        alert('Notification sent successfully!!!');
        let rep = await fetchWeatherData(farmerlocation);
        let report = await rep.main;
        sendSMS(farmerphoneno, JSON.stringify(report));
        retval = false;
    }
    return retval;
}

async function fetchWeatherData(location) {
    const apiKey = process.env.apiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    try {
        let data = await fetch(url);
        let response = await data.json();
        return response;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function sendSMS(phoneNumber, report) {
    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    let url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    try {
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " + btoa(accountSid + ":" + authToken),
            },
            body: new URLSearchParams({
                From: '+16504580197',
                To: phoneNumber,
                Body: report,
            }),
        });
        let response = await data.json();
        console.log(response);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }

}






