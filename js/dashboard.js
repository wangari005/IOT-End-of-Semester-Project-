import { db } from "./firebase-config.js";

import {
    ref,
    onValue
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const temperatureElement =
document.getElementById("temperature");

const humidityElement =
document.getElementById("humidity");

const soilMoistureElement =
document.getElementById("soilMoisture");

const sensorRef = ref(db, "sensorData");

onValue(sensorRef, (snapshot) => {

    const data = snapshot.val();

    if(data){

        temperatureElement.innerHTML =
        data.temperature + " °C";

        humidityElement.innerHTML =
        data.humidity + " %";

        soilMoistureElement.innerHTML =
        data.soilMoisture + " %";

    }

});