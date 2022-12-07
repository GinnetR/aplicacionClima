import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";
import * as dotenv from 'dotenv';
dotenv.config()

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    //imprimir el menu 
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostar mensaje
        const termino = await leerInput("Ciudad:  ");

        // Buscar los lugares

        const lugares = await busquedas.ciudad(termino);

        //Seleccionar el lugar
        const id = await listarLugares(lugares);
        if(id==="0")continue;
        const lugarSel = lugares.find(l => l.id === id);
        //guardar DB
        busquedas.agregarHistorial(lugarSel.nombre);

        //clima

        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);


        //Mostrar resultados 
        console.clear();
        console.log("\nInformacion de la ciudad\n".blue);
        console.log("Ciudad", lugarSel.nombre.blue);
        console.log("Lat:", lugarSel.lat);
        console.log("Lng:", lugarSel.lng);
        console.log("Temperatura:", clima.temp);
        console.log("Minima:", clima.max);
        console.log("Maxima:", clima.min);
        console.log("El clima es:", clima.desc.blue);

        break;
      case 2:
              busquedas.historialCapitalizado.forEach((lugar,i)=>{
                const idx = `${i+1}.`.green;
                console.log(`${idx} ${lugar}`)

              })
        break;

    }

    if (opt !== 0) await pausa();

  } while (opt !== 0);



}
main();