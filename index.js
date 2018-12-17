fetch('api.json').then(function(response) {
    // remember json() returns another promise
    return response.json();
})
.then(function(data) {
    getAllAirtableData(data.key);
});

function getAllAirtableData(key) {
    var headers = new Headers();

    // Airtable API server isn't configured correctly to accept header credentials
    // due to the wildcard 'access-control-allow-origin' header
    //headers.append("Authorization", "Bearer " + key);
    //headers.append("Content-Type", "application/json");
    var queryParams = new URLSearchParams();
    queryParams.append("api_key", key);
    queryParams.append("maxRecords", 5);


    fetch('https://api.airtable.com/v0/app0f4JReG4aRbpsM/Programme%20Card%20Stack?' + queryParams.toString(), {
        method: "GET",
    }).then(function(response) {
        if(response.ok) {
            //console.log(response.json());
            return response.json();
        } else {
            console.log("HTTP error getting Airtable data: " + response.statusText);
        }
    })
    .then(function(data) {
        console.log(data);
        data.records.forEach(function(startup) {
            $("#startups").append('<li>' + startup.fields["Programme name"] + '</li>');
        });
    }).catch(function(error) {
        console.log("Error retrieving the Airtable data: ", error);
    });
}