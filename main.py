import machine
import dht
import network
import urequests
import ujson
import time

# --- WiFi Config ---
WIFI_SSID = "Wokwi-GUEST"
WIFI_PASSWORD = ""

# --- Firebase Config ---
FIREBASE_URL = "https://iot-project-d9538-default-rtdb.firebaseio.com"
FIREBASE_PATH = "/sensor_readings.json"

# --- Sensor Setup ---
dht_sensor = dht.DHT22(machine.Pin(18))

soil_adc = machine.ADC(machine.Pin(34))
soil_adc.atten(machine.ADC.ATTN_11DB)
soil_adc.width(machine.ADC.WIDTH_12BIT)

DRY_VALUE = 4095
WET_VALUE = 1500

def read_soil_percentage():
    raw = soil_adc.read()
    percentage = (DRY_VALUE - raw) * 100 // (DRY_VALUE - WET_VALUE)
    percentage = max(0, min(100, percentage))
    return raw, percentage

def connect_wifi():
    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    print("Connecting to WiFi", end="")
    sta_if.connect(WIFI_SSID, WIFI_PASSWORD)
    while not sta_if.isconnected():
        print(".", end="")
        time.sleep(0.5)
    print(" Connected!")
    print("IP Address:", sta_if.ifconfig()[0])

def sync_ntp():
    try:
        import ntptime
        ntptime.host = "pool.ntp.org"
        ntptime.settime()
        print("Time synced via NTP")
    except Exception as e:
        print("NTP sync failed:", e)

def get_timestamp():
    t = time.localtime()
    return "{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(
        t[0], t[1], t[2], t[3], t[4], t[5]
    )

def send_to_firebase(payload):
    try:
        url = FIREBASE_URL + FIREBASE_PATH
        response = urequests.post(url, data=ujson.dumps(payload))
        print("Firebase response:", response.status_code)
        response.close()
    except Exception as e:
        print("Firebase error:", e)

# --- Main ---
connect_wifi()
sync_ntp()

print("\n=== ICS 4D Group 7 - Soil & Climate Monitor ===")
print("Sending readings to Firebase every 5 seconds...")
print("-" * 55)

reading_count = 0

while True:
    try:
        dht_sensor.measure()
        temperature = dht_sensor.temperature()
        humidity = dht_sensor.humidity()

        raw, soil_pct = read_soil_percentage()
        reading_count += 1

        timestamp = get_timestamp()

        payload = {
            "reading": reading_count,
            "temperature": temperature,
            "humidity": humidity,
            "soil_raw": raw,
            "soil_moisture": soil_pct,
            "timestamp": timestamp
        }

        print(f"[{reading_count:03d}] {timestamp} | Temp: {temperature:.1f}°C | "
              f"Humidity: {humidity:.1f}% | Soil: {soil_pct}%")

        send_to_firebase(payload)

    except OSError as e:
        print(f"DHT22 read error: {e}")

    time.sleep(5)