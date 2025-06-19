
const socket=io();

const map=L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution : "Real-Time Tracking Project by Ritik"}).addTo(map);

const marker={};

socket.on("connect",()=>{

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {longitude,latitude}=position.coords;
             if (!marker[socket.id]) {
          map.setView([latitude, longitude], 16);
        }

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

});




socket.on("recieve-location",(data)=>{
    const {id,latitude,longitude}=data;

    if(marker[id]){
    marker[id].setLatLng([latitude,longitude]);
}else{
    marker[id]= L.marker([latitude,longitude]).addTo(map);
}
});



socket.on("user-disconnect",(id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})