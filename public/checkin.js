if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        document.getElementById("lat").textContent = lat.toFixed(2)
        document.getElementById("lon").textContent = lon.toFixed(2)
        // console.log(pos)

        // // construct the data package to transmit to server
        // const data = { lat, lon }
        // const options = {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "application/json" 
        //     },
        //     body: JSON.stringify(data),
        // }
        // // and send to server
        // const res = await fetch('/api', options)
        // // and check returned confirmation from server
        // const chk = await res.json()
        // console.log(chk)

        // collect the weather at this location ex.: http://api.weatherapi.com/v1/current.json?key=6c87dd2e12904443a1761609202106&q=37.8267, -122.4233
        // const api_url = `http://api.weatherapi.com/v1/current.json?key=6c87dd2e12904443a1761609202106&q=${lat},${lon}`
        // const resWeather = await fetch(api_url)
        // const jsonWeather = await resWeather.json()
        // console.log(jsonWeather)
        // if by the above code u get a CORS error (meaning, u cannot call this api from client side) we need to call this api from the server
        // meaning the client send the lat, lon to the server, which in turn send the request to the api. receives it and sends it to the client
        // use route-parameters (this is why we have : in the route call)
        // const api_url = `/weather/${lat} ${lon}`
        const api_url = `/weather/${lat},${lon}`
        // console.log(api_url)
        const all_res = await fetch(api_url)
        // console.log(weather_res)
        const all_data = await all_res.json()
        console.log(all_data)
        // populate dom elements
        document.getElementById('location').textContent = all_data.weather.location.name
        document.getElementById('country').textContent = all_data.weather.location.country
        document.getElementById('summary').textContent = all_data.weather.current.condition.text
        document.getElementById('temperature').textContent = all_data.weather.current.temp_c

        // populate the weather elements
        // console.log(all_data.aq.results)
        if (all_data.aq.results.length != 0) {
            document.getElementById('aq_location').textContent = all_data.aq.results[0].location

            let aq_measure
            if (all_data.aq.results[0].measurements[0] != null) {
                aq_measure = all_data.aq.results[0].measurements[0]
                document.getElementById('aq_date').textContent = aq_measure.lastUpdated
                document.getElementById('pm25').textContent = aq_measure.parameter
                document.getElementById('pm25_value').textContent = aq_measure.value
                document.getElementById('pm25_unit').textContent = aq_measure.unit
            }
    
            if (all_data.aq.results[0].measurements[1]) {
                aq_measure = all_data.aq.results[0].measurements[1]
                document.getElementById('pm10').textContent = aq_measure.parameter
                document.getElementById('pm10_value').textContent = aq_measure.value
                document.getElementById('pm10_unit').textContent = aq_measure.unit
            }
    
            if (all_data.aq.results[0].measurements[2]) {
                aq_measure = all_data.aq.results[0].measurements[2]
                document.getElementById('so2').textContent = aq_measure.parameter
                document.getElementById('so2_value').textContent = aq_measure.value
                document.getElementById('so2_unit').textContent = aq_measure.unit
            }
    
            if (all_data.aq.results[0].measurements[3]) {
                aq_measure = all_data.aq.results[0].measurements[3]
                document.getElementById('no2').textContent = aq_measure.parameter
                document.getElementById('no2_value').textContent = aq_measure.value
                document.getElementById('no2_unit').textContent = aq_measure.unit
            }
    
            if (all_data.aq.results[0].measurements[4]) {
                aq_measure = all_data.aq.results[0].measurements[4]
                document.getElementById('o3').textContent = aq_measure.parameter
                document.getElementById('o3_value').textContent = aq_measure.value
                document.getElementById('o3_unit').textContent = aq_measure.unit
            }
        } else {
            console.log("no air quality readings!")
        }

        const weather = all_data.weather
        const aq = all_data.aq
        document.getElementById('checkin').addEventListener('click', async event => {
            // construct the data package to transmit to server
            const data = { lat, lon, weather, aq }
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(data),
            }
            // and send to server
            const res = await fetch('/api', options)
            // and check returned confirmation from server
            const chk = await res.json()
            // console.log(chk)
        })
    })
} else {
    console.log("geolocation is diabled in browser!")
}
