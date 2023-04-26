import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import { Asset, MarkerPoint } from "../interfaces";
import { type } from "os";
// import the mapbox-gl styles so that the map is displayed correctly

type mapProps = {
  points: MarkerPoint[]
}

function MapboxMap({points}: mapProps) {
    // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();

    // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
    const mapNode = React.useRef(null);


  React.useEffect(() => {
    const node = mapNode.current;
      // if the window object is not found, that means
      // the component is rendered on the server
      // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-98, 55],
      zoom: 2.6,
    });

    //Here is where we insert the markers

    console.log(points)
    for(const markerPoint of points){
      new mapboxgl.Marker()
      .setLngLat(markerPoint.coords)
      .addTo(mapboxMap);
    }
    
    
    // save the map object to React.useState
    setMap(mapboxMap);

        return () => {
      mapboxMap.remove();
    };
  }, [points]);

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap