import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { addConnection } from './extras/connection';
import { Icon } from "leaflet";
import L from 'leaflet';





// const tablaEjemplo=[
//   {id:1, año:"2000", campeon:"real madrid", subcampeon:"Valencia"},
//   {id:2, año:"2300", campeon:"madrid", subcampeon:"vvvencia"},
// ];

// const columnas =[
//   {
//     name: 'ID',
//     selector: 'id',
//     sortable: true
//   },
//   {
//     name: 'Año',
//     selector: 'año',
//     sortable: true
//   }, 
//   {
//     name: 'Campeon',
//     selector: 'campeon',
//     sortable: true
//   },  
//   {
//     name: 'Subcampeon',
//     selector: 'subcampeon',
//     sortable: true
//   }
// ]
const connection = new WebSocket("wss://tarea-1.2022-2.tallerdeintegracion.cl/connect");

function App() {  

  const pin_azul = new L.icon({
    iconUrl: require('./pin_azul.png'),
    iconSize: [30, 30],
    popupAnchor: [-4, -70],
  });
  const pin_rojo = new L.icon({
    iconUrl: require('./pin_rojo.png'),
    iconSize: [20, 20],
    popupAnchor: [-4, -70],
  });
  const avioncito = new L.icon({
    iconUrl: require('./avioncito.png'),
    iconSize: [70, 70],
    popupAnchor: [-4, -70],
  });

  const [aviones, setAviones] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [aviones_activos, setAvionesactivos] = useState([])
  const [departures, setDepartures] = useState({});
  const [destinations, setDestinations] = useState({});


  useEffect(() => {   
    const apiCall={
      type: "join", 
      id: "5f1bdd55-b7aa-4e2d-a574-f899bddca4ba",
      username:"ivi"
    }
    connection.onopen = ()=>{
      console.log('websocket cliente conectado jejeje');
      connection.send(JSON.stringify(apiCall));
    }

    connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'plane') {
        // console.log("escuchando socket avion", data.plane);
              HandleAviones(data.plane); 
      }
      else if (data.type === 'flights') {
        HandleVuelo(data.flights); 
      }
    }

    // connection.onclose = ()=>{
    //   connection.close();
    //   console.log('websocket saliendo jejeje');
    // }

  },);




  var aviones_0 =[];
  var activos = [];

  const HandleAviones=(avion) =>{ 
    var flight_id = avion.flight_id;
    var aerolinea_id = avion.airline.id;
    var aerolinea_name = avion.airline.name;
    var capitan = avion.captain;
    var posicion_lat = avion.position.lat;
    var posicion_long = avion.position.long;
    var heading_lat = avion.heading.lat;
    var heading_long = avion.heading.long;
    var ETA = avion.ETA;
    var distance = avion.distance;
    var arrival = avion.arrival;
    var status = avion.status;
    
      
    if (status === "flying"){
      if (activos.includes(flight_id)){
        let index = activos.indexOf(flight_id);
        aviones_0[index][4]=posicion_lat;
        aviones_0[index][5]=posicion_long;
      }
      else{
        activos.push(flight_id);
        aviones_0.push([flight_id, aerolinea_id, aerolinea_name, capitan, posicion_lat, posicion_long, heading_lat, heading_long,
        ETA, distance, arrival, status]);
      }
        // console.log("imprimiendo status", aviones_0);
    // console.log("imprimiendo el set aviones", aviones);
    }
    else{
      if (activos.includes(flight_id)){
        let index = activos.indexOf(flight_id);
        aviones_0.splice(index,1);
      }
    }
  setAviones(aviones_0);
  console.log("informacion del avion en vuelo", aviones);
}

  const HandleVuelo=(data) => {
    var vuelos_0 = [];
    var aviones_activos_0 = [];
     for (var clave in data){
      var vuelo = data[clave];

      var vuelo_id = vuelo.id;
      var id_aeropuerto_salida = vuelo.departure.id;
      var nombre_aeropuerto_salida = vuelo.departure.name;
      var ciudad_aeropuerto_salida = vuelo.departure.city.name;
      var pais_aeropuerto_salida = vuelo.departure.city.country.name;
      var lat_aeropuerto_salida = vuelo.departure.location.lat;
      var long_aeropuerto_salida = vuelo.departure.location.long;

      var id_aeropuerto_entrada = vuelo.destination.id;
      var nombre_aeropuerto_entrada = vuelo.destination.name;
      var ciudad_aeropuerto_entrada = vuelo.destination.city.name;
      var pais_aeropuerto_entrada = vuelo.destination.city.country.name;
      var lat_aeropuerto_entrada = vuelo.destination.location.lat;
      var long_aeropuerto_entrada = vuelo.destination.location.long;

      aviones_activos_0.push(vuelo.id);
      vuelos_0.push([vuelo_id, id_aeropuerto_salida, nombre_aeropuerto_salida, ciudad_aeropuerto_salida, pais_aeropuerto_salida, 
        lat_aeropuerto_salida, long_aeropuerto_salida, id_aeropuerto_entrada, nombre_aeropuerto_entrada, ciudad_aeropuerto_entrada, pais_aeropuerto_entrada, 
        lat_aeropuerto_entrada, long_aeropuerto_entrada]);
    }

    setVuelos(vuelos_0);
    setAvionesactivos(aviones_activos_0);
    
    console.log("vuelo ...................................", vuelos);
    
    }

  




    



  const columnas =[
    {
      name: 'ID',
      selector: vuelos[0],
      sortable: true
    },
    {
      name: 'Año',
      selector: vuelos[1],
      sortable: true
    }, 
    {
      name: 'Campeon',
      selector: vuelos[2],
      sortable: true
    },  
    {
      name: 'Subcampeon',
      selector: vuelos[3],
      sortable: true
    }
  ]
  






  return (

    <div>

    {/* <MapContainer center={[45.4, -75.7]} zoom={2}scrollWheelZoom={false}>
      <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
       {vuelos.map((aeropuesto_salida, aeropuesto_entrada) =>{
            return (
                <Marker
                key={aeropuesto_salida[0]} 
                position={[aeropuesto_salida[11], aeropuesto_salida[12]]}
                icon = {pin_azul}>
                    <Popup>
                       ID vuelo: {aeropuesto_salida[0]}<br/>
                        Nombre: {aeropuesto_salida[8]}<br/>
                        Pais: {aeropuesto_salida[10]}<br/>
                        Ciudad: {aeropuesto_salida[9]}

                    </Popup>
                </Marker>   
                             
            );
            })};
          
          {vuelos.map((aeropuesto_entrada) =>{
            return (
                <Marker
                key={aeropuesto_entrada[0]} 
                position={[aeropuesto_entrada[5], aeropuesto_entrada[6]]}
                icon = {pin_rojo}>
                    <Popup>
                       ID vuelo: {aeropuesto_entrada[0]}<br/>
                        Nombre: {aeropuesto_entrada[2]}<br/>
                        Pais: {aeropuesto_entrada[4]}<br/>
                        Ciudad: {aeropuesto_entrada[3]}
                    </Popup>
                </Marker>                
            );
            })};

            {vuelos.map((aeropuesto) =>{
            return (
                <Polyline
                key={aeropuesto[0]}
                pathOptions={{ color: 'lime' }} 
                positions={[[aeropuesto[11], aeropuesto[12]], [aeropuesto[5], aeropuesto[6]]]}>
                    
                </Polyline>                
            );
            })};

          {aviones.map((avion) =>{
            return (
                <Marker
                key={avion[0]} 
                position={[avion[4], avion[5]]}
                icon = {avioncito}>
                    <Popup>
                    flight_id: {avion[0]}<br/>
                    aerolinea_id: {avion[1]}<br/>
                    aerolinea_name: {avion[2]}<br/>
                    capitan: {avion[3]}<br/>
                    posicion_lat: {avion[4]}<br/>
                    posicion_long: {avion[5]}<br/>
                    heading_lat: {avion[6]}<br/>
                    ETA: {avion[7]}<br/>
                    distance: {avion[8]}<br/>
                    arrival: {avion[9]}<br/>
                    status: {avion[10]}
                    </Popup>
                </Marker>                
            );
            })};

        


      </MapContainer> */}
 
      {/* <DataTable
      columns={columnas}
      data={vuelos}
      title="lalalalla"
      /> */}

    </div>
  );
}

export default App;