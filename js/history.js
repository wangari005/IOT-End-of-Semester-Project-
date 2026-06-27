import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const table = document.getElementById("historyTable");
let allEntries = [];

const sensorRef = ref(db, "sensor_readings");

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        allEntries = Object.values(data);

        // Clear existing rows except header
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Add rows in reverse order (latest first)
        [...allEntries].reverse().forEach((entry) => {
            const row = table.insertRow();
            row.insertCell().textContent = entry.reading;
            row.insertCell().textContent = entry.timestamp || "N/A";
            row.insertCell().textContent = entry.temperature + " °C";
            row.insertCell().textContent = entry.humidity + " %";
            row.insertCell().textContent = entry.soil_moisture + " %";
        });
    }
});

// --- CSV Download ---
function downloadCSV() {
    const headers = ["Reading", "Timestamp", "Temperature (°C)", "Humidity (%)", "Soil Moisture (%)"];
    const rows = allEntries.map(e => [
        e.reading,
        e.timestamp || "N/A",
        e.temperature,
        e.humidity,
        e.soil_moisture
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sensor_readings.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// --- PDF Download ---
function downloadPDF() {
    const printWindow = window.open("", "_blank");
    const rows = [...allEntries].reverse().map(e => `
        <tr>
            <td>${e.reading}</td>
            <td>${e.timestamp || "N/A"}</td>
            <td>${e.temperature} °C</td>
            <td>${e.humidity} %</td>
            <td>${e.soil_moisture} %</td>
        </tr>
    `).join("");

    printWindow.document.write(`
        <html>
        <head>
            <title>Sensor Reading History</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #2E7D32; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #2E7D32; color: white; padding: 10px; }
                td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                tr:nth-child(even) { background: #f4f6f9; }
                .footer { margin-top: 20px; font-size: 0.85rem; color: #888; text-align: center; }
            </style>
        </head>
        <body>
            <h2>🌱 IoT Agricultural Data Collection System</h2>
            <p>Group 4D — Strathmore University | Exported on ${new Date().toLocaleString()}</p>
            <table>
                <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Soil Moisture</th>
                </tr>
                ${rows}
            </table>
            <p class="footer">ICS 4111 Embedded Systems & IoT — Academic Year 2025/2026</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Expose functions to buttons
window.downloadCSV = downloadCSV;
window.downloadPDF = downloadPDF;