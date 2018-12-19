fetch('api.json').then(function(response) {
    // remember json() returns another promise
    return response.json();
})
.then(function(data) {
    getAllAirtableData(data.key).then(function(dataset) {
        if(dataset !== null) {
            // build list.js
            var options = {
                valueNames: ["name", "description", "city", "duration", "sectors"],
                item: 'startup'
            };
            // assign to view div#startups
            new List('startups', options, dataset);
        } else {
            console.log("Dataset is empty");
        }
    }).catch(function(error) {
        console.log("Error retrieving the Airtable data: ", error);
    });
});

function getAllAirtableData(key) {
    var dataset = [];
    // var headers = new Headers();
    // Airtable API server isn't configured correctly to accept header credentials
    // due to the wildcard 'access-control-allow-origin' header
    //headers.append("Authorization", "Bearer " + key);
    //headers.append("Content-Type", "application/json");
    var queryParams = new URLSearchParams();
    queryParams.append("api_key", key);
    // queryParams.append("maxRecords", 5);
    // queryParams.append("offset", "itrDGrDZgn0vkEoxi/recBzWTbWmAn29KVo");

    var promise = fetch('https://api.airtable.com/v0/app0f4JReG4aRbpsM/Programme%20Card%20Stack?' + queryParams.toString(), {
        method: "GET",
    }).then(function(response) {
        if(response.ok) {
            //console.log(response.json());
            return response.json();
        } else {
            console.log("HTTP error getting Airtable data: " + response.statusText);
            return null;
        }
    })
    .then(function(data) {
        console.log(data);
        data.records.forEach(function(startup) {
            dataset.push({
                "id": startup.id,
                "name": startup.fields["Programme name"],
                "description": startup.fields["Programme / Facility Description"],
                "city": startup.fields["City"],
                "duration": startup.fields["Duration"],
                "sectors": startup.fields["Sectors"]
            });
        });
        return Promise.resolve(dataset);
    }).catch(function(error) {
        console.log("Error retrieving the Airtable data: ", error);
        return Promise.resolve(null);
    });

    return promise;
}