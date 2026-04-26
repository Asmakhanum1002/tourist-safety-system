const SAFE_LAT = 12.9716;
const SAFE_LON = 77.5946;
const R = 0.02;

function send(lat, lon){
fetch("/alert",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({lat, lon})
})
.then(r=>r.json())
.then(d=>{
status.innerText = d.message + " | " + d.risk;
document.getElementById("aiStatus").innerText = d.risk;
});
}

function manualAlert(){
navigator.geolocation.getCurrentPosition(p=>{
send(p.coords.latitude, p.coords.longitude);
});
}

function startTracking(){
navigator.geolocation.watchPosition(p=>{
let lat=p.coords.latitude;
let lon=p.coords.longitude;

status.innerText = "Tracking: " + lat + ", " + lon;

if(Math.abs(lat-SAFE_LAT)>R || Math.abs(lon-SAFE_LON)>R){
status.innerText="⚠️ Outside Safe Zone!";
send(lat,lon);
}
});
}