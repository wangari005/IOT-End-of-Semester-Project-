import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const soilMoistureElement = document.getElementById("soilMoisture");

const sensorRef = ref(db, "sensor_readings");

// Initialize Chart
const ctx = document.getElementById("sensorChart").getContext("2d");
const sensorChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Temperature (°C)",
                data: [],
                borderColor: "#e53935",
                backgroundColor: "rgba(229,57,53,0.1)",
                tension: 0.4,
                fill: true
            },
            {
                label: "Humidity (%)",
                data: [],
                borderColor: "#1e88e5",
                backgroundColor: "rgba(30,136,229,0.1)",
                tension: 0.4,
                fill: true
            },
            {
                label: "Soil Moisture (%)",
                data: [],
                borderColor: "#2E7D32",
                backgroundColor: "rgba(46,125,50,0.1)",
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: "top" }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const entries = Object.values(data);

        // Update latest reading cards
        const latest = entries[entries.length - 1];
        temperatureElement.innerHTML = latest.temperature + " °C";
        humidityElement.innerHTML = latest.humidity + " %";
        soilMoistureElement.innerHTML = latest.soil_moisture + " %";

        // Build chart from last 10 readings
        const recent = entries.slice(-10);

        sensorChart.data.labels = recent.map((e, i) => "Reading " + (e.reading || i + 1));
        sensorChart.data.datasets[0].data = recent.map(e => e.temperature);
        sensorChart.data.datasets[1].data = recent.map(e => e.humidity);
        sensorChart.data.datasets[2].data = recent.map(e => e.soil_moisture);

        sensorChart.update();
    }
});