const express = require('express')
const dataStore = require('nedb')
const { json } = require('body-parser')
const fetch = require('node-fetch')
require('dotenv').config()

// console.log(process.env)

const app = express()
app.listen(3000, () => console.log("Listning on port 3000..."))
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

// initialize the db
const db = new dataStore('db.db')
db.loadDatabase()

// route 1 - get coords from client
app.post('/api', (req, res) => {
    // collect data sent by client 
    const data = req.body
    const timestamp = Date.now()
    data.timestamp = timestamp  // and add the timestamp to the data packet
    // and insert into db
    db.insert(data)
    // and send confirmation back to client
    res.json(data)
})

// route 2 - display the coordinates collection from db
app.get('/api', (req, res) => {
    db.find({}, (err, data) => {
        if (err) {
            console.log(err)
            res.end()
            return
        }
        res.json(data)  // send the coords collection to client
    })
})

// route 3 - call to the weather api from server by using the lat, lon sent be the client
// this is proxy server type code, meaning, u cannot make direct call from client to an api - u are calling from the server; hence, the server is acting as a proxy to the client
// u will get a 'fetch is not defined' error from the server. this is because fetch is a client side code. to get it on server side u need to install package node-fetch
// app.get('/weather/:lat/:lon', async (req, res) => {
app.get('/weather/:latlon', async (req, res) => {
    console.log(req.params)
    // const lat = req.params.lat
    // const lon = req.params.lon
    const latlon = req.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]
    // console.log(lat, lon)
    // const api_url = `weather/${lat},${lon}`
    // const api_key = '6c87dd2e12904443a1761609202106&q'
    const api_key = process.env.API_KEY
    const weather_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}=${lat},${lon}`
    // const weather_url = `http://api.weatherapi.com/v1/current.json?key=6c87dd2e12904443a1761609202106&q=${lat},${lon}`
    // const api_url = `http://api.weatherapi.com/v1/current.json?key=6c87dd2e12904443a1761609202106&q=37.8267, -122.4233`
    const weather_res = await fetch(weather_url)
    const weather_data = await weather_res.json()
    // res.json(weather_data)

    // also get the air quality data for this coordinates; like this https://api.openaq.org/v1/latest?coordinates=52.52,13.40
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aq_res = await fetch(aq_url)
    const aq_data = await aq_res.json()

    // bundle the weather data and aq data
    const data = {
        weather: weather_data,
        aq: aq_data
    }
    // bundle the data and then send to client
    res.json(data)
    // console.log(weather_data)
})