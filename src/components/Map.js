import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"
import "react-leaflet-markercluster/dist/styles.min.css";

import "./Map.css"
// Custom icon using react-icons
const customIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/ios-filled/50/FF0000/marker.png",
  iconSize: [35, 35],
  iconAnchor: [12, 41],
});

const locations = [
    {
      id: 1,
      name: "Kairaa Tech Serve Private Limited, No.10 Eshwari Nagar, Gowrivakkam, Chennai - 600073",
      position: [12.92305118635245, 80.16476189372598],
      link: " https://www.google.co.in/maps/search/Kairaa+Tech+Serve+Private+Limited,+No.10+Eshwari+Nagar,+Gowrivakkam,+Chennai+600073/@12.9228368,80.162187,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      id: 2,
      name: "Kairaa Tech Serve Private Limited, 76-O, Sri Jothi Complex, 3rd Floor, N.E.E. Road, Thillainagar, Trichy - 620018",
      position: [10.83541182966574, 78.65698616998259],
     
      link:"https://www.google.com/maps/place/Kairaa+Tech+serve+pvt+ltd/@10.8263752,78.6844839,17z/data=!3m1!4b1!4m6!3m5!1s0x3baaf5744bc27c97:0x980fd19c7815466f!8m2!3d10.8263699!4d78.6870588!16s%2Fg%2F11vf1_3_4c?hl=en&entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: 3,
      name: "Kairaa Blockchain Academy 131, DB Road, 2nd Floor, RS Puram, Coimbatore 641002",
      position: [11.006165131525952, 76.9513183203932],
      link: "https://www.google.co.in/maps/place/Kairaa+Blockchain+Academy/@11.0067865,76.9485288,17z/data=!4m10!1m2!2m1!1sKairaa+Blockchain+Academy+131,+DB+Road,+2nd+Floor,+RS+Puram,+Coimbatore+641002!3m6!1s0x3ba8591b63cb9031:0xb7ccd4bb77643789!8m2!3d11.0074929!4d76.9509126!15sCk5LYWlyYWEgQmxvY2tjaGFpbiBBY2FkZW15IDEzMSwgREIgUm9hZCwgMm5kIEZsb29yLCBSUyBQdXJhbSwgQ29pbWJhdG9yZSA2NDEwMDJaTCJKa2FpcmFhIGJsb2NrY2hhaW4gYWNhZGVteSAxMzEgZGIgcm9hZCAybmQgZmxvb3IgcnMgcHVyYW0gY29pbWJhdG9yZSA2NDEwMDKSARBjb3Jwb3JhdGVfb2ZmaWNlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5rYjBsWVJYRm5SUkFC4AEA!16s%2Fg%2F11vkg4cg4r?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"},
    
    {
      id: 4,
      name: "KAIRAA TECHSERVE PRIVATE LIMITED, No.12/1 Vasantha Nagar Palayankottai circle, Tirunelveli - 627002",
      position: [8.701579022218034, 77.7269629927319],
      link: "https://www.google.co.in/maps/place/Kairaa+Tech+serve+pvt+ltd/@8.6998372,77.7232495,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0413241f9d7961:0xc243f966dcb8a870!8m2!3d8.6998319!4d77.7258244!16s%2Fg%2F11vb8k87v5?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      id: 5,
      name: "KAIRAA BLOCKCHAIN ACADEMY, Plot no.4, first floor Thendral Nagar Extn., Chathuvachari, Vellore - 632009",
      position: [12.93624822709992, 79.14791283605607],
      link: "https://www.google.co.in/maps/search/KAIRAA+BLOCKCHAIN+ACADEMY+Plot+no.4,+first+floor+Thendral+Nagar+Extn.,+Chathuvachari,+Vellore+-+632+009/@12.9359502,79.1453594,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      id: 6,
      name: "KAIRAA TECH SERVE PRIVATE LIMITED, The Ground floor, Door No. 34, TM Nagar, Mattuthavani Bus Stand, Madurai – 625107",
      position: [9.949212807489443, 78.15986779552071],
      link: "https://www.google.co.in/maps/place/Kairaa+Tech+serve+pvt+ltd/@9.9467848,78.1551236,17z/data=!4m10!1m2!2m1!1sKAIRAA+TECH+SERVE+PRIVATE+LIMITED,+The+Ground+floor,+Door+No.+34,+TM+Nagar,+Mattuthavani+Bus+Stand,+Madurai+%E2%80%93+625+107!3m6!1s0x3b00c57026ac87a7:0xb0568da427fa468a!8m2!3d9.9489909!4d78.1597927!15sCndLQUlSQUEgVEVDSCBTRVJWRSBQUklWQVRFIExJTUlURUQsIFRoZSBHcm91bmQgZmxvb3IsIERvb3IgTm8uIDM0LCBUTSBOYWdhciwgTWF0dHV0aGF2YW5pIEJ1cyBTdGFuZCwgTWFkdXJhaSDigJMgNjI1IDEwN5IBEHNvZnR3YXJlX2NvbXBhbnngAQA!16s%2Fg%2F11wj3kc_zv?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"},
   
    {
      id: 7,
      name: "Dno.2/3, Manimegalay Street, Advatha Asram Road, Balaji Nagar, Salem - 636004",
      position: [11.674506147072098, 78.14207392253769],
      link: "https://www.google.com/maps/place/Kairaa+Blockchain+Academy/@10.9320426,71.5639846,5.42z/data=!4m15!1m7!3m6!1s0x3babf1a0e5d0d3a1:0x6cf9978ec24286!2sKairaa+Blockchain+Academy!8m2!3d11.6742645!4d78.1420632!16s%2Fg%2F11w4mrwybx!3m6!1s0x3babf1a0e5d0d3a1:0x6cf9978ec24286!8m2!3d11.6742645!4d78.1420632!15sChFLYWlyYWEgVGVjaCBzYWxlbZIBEGVkdWNhdGlvbl9jZW50ZXLgAQA!16s%2Fg%2F11w4mrwybx?hl=en&entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    },
     
    {
      id: 8,
      name: "No.4-2044/B, Near Savithriamma College, Vellore road, Chittoor - 517 002",
      position: [13.1955266, 79.0925862],
      link: "https://www.google.com/maps/place/4-2044%2FB,+Vellore+Rd,+Durga+Nagar+Colony,+Greamspet,+Chittoor,+Andhra+Pradesh+517002/@13.1955266,79.0925862,320m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3bad5c1342214397:0x49ec2c581e83f1fe!2sSubbhaaramam+halls!8m2!3d13.195396!4d79.093789!16s%2Fg%2F1pyqn857q!3m5!1s0x3bad5c1343e82399:0x309a2998537a0a23!8m2!3d13.1952327!4d79.0937567!16s%2Fg%2F11q2m5zfkx?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    },
     
    // {
    //   id: 7,
    //   name: "Dno.2/3, Manimegalay Street, Advatha Asram Road, Balaji Nagar, Salem - 636004",
    //   position: [11.674506147072098, 78.14207392253769],
    //   link: "https://www.google.com/maps/place/Kairaa+Blockchain+Academy/@10.9320426,71.5639846,5.42z/data=!4m15!1m7!3m6!1s0x3babf1a0e5d0d3a1:0x6cf9978ec24286!2sKairaa+Blockchain+Academy!8m2!3d11.6742645!4d78.1420632!16s%2Fg%2F11w4mrwybx!3m6!1s0x3babf1a0e5d0d3a1:0x6cf9978ec24286!8m2!3d11.6742645!4d78.1420632!15sChFLYWlyYWEgVGVjaCBzYWxlbZIBEGVkdWNhdGlvbl9jZW50ZXLgAQA!16s%2Fg%2F11w4mrwybx?hl=en&entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D",
    // },
   
  ];

// Component to fit all markers
const FitMapToBounds = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.position));
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  return null;
};

const Map1 = () => {
  return (
    <div className="map-container" style={{ height: "100%", width: "100%", minHeight: "400px" }}>
    <MapContainer
      center={[11.1271, 78.6569]}
      zoom={7}
      style={{ height: "100%", width: "100%" }} // Ensuring MapContainer fills its parent
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
  
      <MarkerClusterGroup>
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.position} icon={customIcon}>
            <Popup>
              <div>
                <strong>{loc.name}</strong>
                <br />
                <a href={loc.link} target="_blank" rel="noopener noreferrer">
                  View Location
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
  
      <FitMapToBounds locations={locations} />
    </MapContainer>
  </div>
  
  );
};

export default Map1;