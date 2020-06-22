// leaflet code
// below code is all for implementing leaflet.js
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = '&copy; <a href ="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// making a map and icon
const mymap = L.map('checkinMap').setView([0, 0], 2);
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(mymap)

getData()

async function getData() {
    const res = await fetch('/api')
    const data = await res.json()
    console.log(data)

    // var issIcon = L.icon({
    // iconUrl: 'iss200.png',
    // iconSize: [50, 32],
    // iconAnchor: [25, 16]
    // });
    
    for (item of data) {
        // const root = document.createElement('p')
        // const geo = document.createElement('div')
        // const ts = document.createElement('div')
        // const br = document.createElement('br')

        // const dateString = new Date(item.timestamp).toDateString()
        // ts.textContent = dateString

        // geo.textContent = `${item.lat}º, ${item.lon}º`

        // root.append(ts, geo)
        // document.body.append(root)

        // const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap);
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        let txt = `We are at ${item.weather.location.name}, ${item.weather.location.country}. 
        The weather here is ${item.weather.current.condition.text} with a temperature of ${item.weather.current.temp_c}º Celcius.`
        if (item.aq.results[0] == null) {
            txt += ' No air quality readings.'
        } else {
            txt += `
            The air quality at the nearest location ${item.aq.results[0].location}, measured on date: ${item.aq.results[0].measurements[0].lastUpdated} are:
            => ${item.aq.results[0].measurements[0].parameter} = ${item.aq.results[0].measurements[0].value} ${item.aq.results[0].measurements[0].unit}
            `
            // => ${item.aq.results[1].measurements[1].parameter} = ${item.aq.results[1].measurements[1].value} ${item.aq.results[1].measurements[1].unit}
            // => ${item.aq.results[2].measurements[2].parameter} = ${item.aq.results[2].measurements[2].value} ${item.aq.results[2].measurements[2].unit}
            // => ${item.aq.results[3].measurements[3].parameter} = ${item.aq.results[3].measurements[3].value} ${item.aq.results[3].measurements[3].unit}
            // => ${item.aq.results[4].measurements[4].parameter} = ${item.aq.results[4].measurements[4].value} ${item.aq.results[4].measurements[4].unit}
            // => ${item.aq.results[5].measurements[5].parameter} = ${item.aq.results[5].measurements[5].value} ${item.aq.results[5].measutements[5].unit}
        }

        marker.bindPopup(txt)


    }
}

