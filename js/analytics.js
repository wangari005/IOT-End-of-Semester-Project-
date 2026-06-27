import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const sensorRef = ref(db, "sensor_readings");

// Bar chart
const barCtx = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(barCtx, {
    type: "bar",
    data: {
        labels: ["Temperature (°C)", "Humidity (%)", "Soil Moisture (%)"],
        datasets: [{
            label: "Average Values",
            data: [0, 0, 0],
            backgroundColor: ["rgba(229,57,53,0.7)", "rgba(30,136,229,0.7)", "rgba(46,125,50,0.7)"],
            borderColor: ["#e53935", "#1e88e5", "#2E7D32"],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

// Line chart
const lineCtx = document.getElementById("lineChart").getContext("2d");
const lineChart = new Chart(lineCtx, {
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
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const entries = Object.values(data);

        // Calculate averages
        const avgTemp = (entries.reduce((s, e) => s + e.temperature, 0) / entries.length).toFixed(1);
        const avgHumidity = (entries.reduce((s, e) => s + e.humidity, 0) / entries.length).toFixed(1);
        const avgSoil = (entries.reduce((s, e) => s + e.soil_moisture, 0) / entries.length).toFixed(1);

        // Update cards
        document.getElementById("avgTemp").textContent = avgTemp + " °C";
        document.getElementById("avgHumidity").textContent = avgHumidity + " %";
        document.getElementById("avgSoil").textContent = avgSoil + " %";

        // Update bar chart
        barChart.data.datasets[0].data = [avgTemp, avgHumidity, avgSoil];
        barChart.update();

        // Update line chart with all readings
        lineChart.data.labels = entries.map(e => "R" + e.reading);
        lineChart.data.datasets[0].data = entries.map(e => e.temperature);
        lineChart.data.datasets[1].data = entries.map(e => e.humidity);
        lineChart.data.datasets[2].data = entries.map(e => e.soil_moisture);
        lineChart.update();
    }
});