import fs from "fs";
import axios from 'axios';

class Busquedas {
    historial = [];
    dbPath = './db/database.json'

    constructor() {
        // TODO:  leer BD si existe 
        this.leerBD();
    }

    get historialCapitalizado(){

        return this.historial.map(lugar=>{
            let palabra = lugar.split(" ");
            palabra = palabra.map(p => p[0].toUpperCase() + p.substring(1));

            return palabra.join("");
        })
    }

    get ParamsMapbox() {
        return {
            "access_token": process.env.MAPBOX_key,
            "limit": 5,
            "language": "es"
        }
    }
    get ParamsOPENWEATHER() {
        return {
            "appid": process.env.OPENWEATHER_KEY,
            "lang": "es",
            "units": "metric",
        }
    }


    async ciudad(lugar = "") {

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.ParamsMapbox

            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];

        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.ParamsOPENWEATHER, lat, lon }
            })
            const resp = await instance.get();
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            return [];

        }
    }

    agregarHistorial(lugar = "") {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarBD();

    }
    guardarBD() {

        const payload = {
            historial: this.historial

        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }



    leerBD() {
        if(!fs.existsSync(this.dbPath)) return;

        const info =fs.readFileSync(this.dbPath,{encoding: "utf-8"});
        const data = JSON.parse(info);

        this.historial = data.historial


    }
}

export { Busquedas }