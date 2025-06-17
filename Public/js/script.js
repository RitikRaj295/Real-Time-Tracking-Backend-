
const socket=io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {longitude,latitude}=position.coords;
            console.log({latitude,longitude});
            socket.emit("send-location",{longitude,latitude})
        },
        (error)=>{
            console.error("error found :",error.message);
        },
        {
          
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0,

            
        }
    )
}
const map=L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution : "Real-Time Tracking Project by Ritik"}).addTo(map);

const marker={};

socket.on("recieve-location",(data)=>{
    const {id,latitude,longitude}=data;
    console.log(id,latitude,longitude);
    map.setView([latitude,longitude]);
    L.marker([latitude,longitude]).addTo(map)
});

if(marker[id]){
    marker[id].setLatLng([latitude,longitude]);
}else{
    marker[id]= L.marker([latitude,longitude]).addTo(map);
}

socket.on("user-disconnect",(id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})