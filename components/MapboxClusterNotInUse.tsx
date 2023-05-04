import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import { Asset, MarkerPoint } from "../interfaces";
// import the mapbox-gl styles so that the map is displayed correctly
import { GeoJSON,FeatureCollection,Feature } from "geojson";


//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { assert } from "console";
import { title } from "process";

type mapProps = {
  points: MarkerPoint[]
}

function MapboxMap({points}: mapProps) {
    // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const filteredData = useSelector((state: RootState) => state.assets.assets)
  const [geoMapPoints,setGeoMapPoints] = React.useState<Feature[]>()

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
    const mapNode = React.useRef(null);

  React.useEffect(() => {


    const geoPoints:GeoJSON = { "type": "FeatureCollection",
    features: []
    }

    for(const point of points){
      geoPoints.features.push(
        {
          type: "Feature",
          geometry: {type: "Point", coordinates: [point.coords[0], point.coords[1]]},
          "properties": {
            assets: point.assets,
            "asset_count": point.assets.length,
            title:'test'
          }
        }
      )
    }

    console.log(geoPoints)

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

    setMap(mapboxMap);
    
    mapboxMap.once('load',()=>{

      //Add the GeoJSON source to the map
      mapboxMap.addSource("assets",{
        type:'geojson',
        data:geoPoints,
        cluster:true,
        clusterMaxZoom:10,
        clusterRadius:20,
      })

      //Add the circles and color them 
      mapboxMap.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'assets',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
            'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,30,
            30,750,
            40
            ]
        }
        });

        mapboxMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'assets',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': ['get', 'point_count'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
        });

        mapboxMap.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'assets',
          filter: ['!', ['has', 'point_count']],
          paint: {
          'circle-color': '#11b4da',
          'circle-radius': 25,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
          }
        });


        mapboxMap.addLayer({
          id: 'unclustered-poin0-text',
          type: 'symbol',
          source: 'assets',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': ['get', 'asset_count'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
            }
        });
    
    return () => {
  mapboxMap.remove();
};

    })

   

  }, [points]);

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap