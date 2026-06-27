import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Thresholds for Busia County smallholder farming
const THRESHOLDS = {
    temp: { min: 15, max: 35 },
    humidity: { min: 30, max: 80 },
    soil: { min: 20, max: 80 }
};

const sensorRef = ref(db, "sensor_readings");

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const entries = Object.values(data);
        const latest = entries[entries.length - 1];

        const alerts = [];

        // Check temperature
        const tempEl = document.getElementById("tempStatus");
        if (latest.temperature < THRESHOLDS.temp.min) {
            tempEl.textContent = "⚠ Too Cold (" + latest.temperature + "°C)";
            tempEl.style.color = "#e53935";
            alerts.push("⚠ Temperature is too low at " + latest.temperature + "°C. Minimum safe level is " + THRESHOLDS.temp.min + "°C.");
        } else if (latest.temperature > THRESHOLDS.temp.max) {
            tempEl.textContent = "⚠ Too Hot (" + latest.temperature + "°C)";
            tempEl.style.color = "#e53935";
            alerts.push("⚠ Temperature is too high at " + latest.temperature + "°C. Maximum safe level is " + THRESHOLDS.temp.max + "°C.");
        } else {
            tempEl.textContent = "✓ Normal (" + latest.temperature + "°C)";
            tempEl.style.color = "#2E7D32";
        }

        // Check humidity
        const humEl = document.getElementById("humidityStatus");
        if (latest.humidity < THRESHOLDS.humidity.min) {
            humEl.textContent = "⚠ Too Dry (" + latest.humidity + "%)";
            humEl.style.color = "#e53935";
            alerts.push("⚠ Humidity is too low at " + latest.humidity + "%. Minimum safe level is " + THRESHOLDS.humidity.min + "%.");
        } else if (latest.humidity > THRESHOLDS.humidity.max) {
            humEl.textContent = "⚠ Too Humid (" + latest.humidity + "%)";
            humEl.style.color = "#e53935";
            alerts.push("⚠ Humidity is too high at " + latest.humidity + "%. Maximum safe level is " + THRESHOLDS.humidity.max + "%.");
        } else {
            humEl.textContent = "✓ Normal (" + latest.humidity + "%)";
            humEl.style.color = "#2E7D32";
        }

        // Check soil moisture
        const soilEl = document.getElementById("soilStatus");
        if (latest.soil_moisture < THRESHOLDS.soil.min) {
            soilEl.textContent = "⚠ Too Dry (" + latest.soil_moisture + "%)";
            soilEl.style.color = "#e53935";
            alerts.push("⚠ Soil moisture is too low at " + latest.soil_moisture + "%. Irrigation may be needed.");
        } else if (latest.soil_moisture > THRESHOLDS.soil.max) {
            soilEl.textContent = "⚠ Waterlogged (" + latest.soil_moisture + "%)";
            soilEl.style.color = "#e53935";
            alerts.push("⚠ Soil moisture is too high at " + latest.soil_moisture + "%. Risk of waterlogging.");
        } else {
            soilEl.textContent = "✓ Normal (" + latest.soil_moisture + "%)";
            soilEl.style.color = "#2E7D32";
        }

        // Render alerts list
        const alertsList = document.getElementById("alertsList");
        if (alerts.length === 0) {
            alertsList.innerHTML = '<div class="card"><p style="color:#2E7D32;">✓ All sensor readings are within safe ranges.</p></div>';
        } else {
            alertsList.innerHTML = alerts.map(a =>
                '<div class="card" style="border-left: 4px solid #e53935; margin-bottom:15px;"><p>' + a + '</p></div>'
            ).join("");
        }
    }
});