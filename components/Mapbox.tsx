import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
import { Asset, MarkerPoint } from "../interfaces";
import { type } from "os";
// import the mapbox-gl styles so that the map is displayed correctly


//Redux Imports
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { updateFilteredAssets } from "../redux/assetsSlice";

type mapProps = {
  points: MarkerPoint[]
}

function MapboxMap({points}: mapProps) {
  const dispatch = useDispatch()

  // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const filteredData = useSelector((state: RootState) => state.assets.assets)

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

    /**
     * Retuns a set of colors depending on the risk rate
     * 
     * @param riskRate 
     * @returns 
     */
    function makerColor(riskRate:number){
      let colors = {marker:'',text:''}
      if(riskRate <= 0.4){
        //Low risk
        colors.marker = "rgb(53, 167, 255)"
        colors.text = 'black'
      }
      else if(riskRate > 0.4 && riskRate <= 0.75){
        //Medium risk
        colors.marker ="rgb(255, 247, 76)"
        colors.text = 'black'
      }else if(riskRate > 0.75){
        //Big risk
        colors.marker ="rgb(255, 89, 100)"
        colors.text = 'white'
      }
      return colors
    }


    //Here is where we insert the markers
    for(const markerPoint of points){

      const allRiskRates = markerPoint.assets.map((asset)=>{
        return Number(asset.riskRating)
      })

      //Sums all the risk rates and divide by the number of assets in that location
      const averageRiskRate = allRiskRates.reduce((a,b)=>{return a+b})/allRiskRates.length

      //const avg = markerPoint
      const el = document.createElement('div');
      el.className = 'marker'
      el.innerHTML = averageRiskRate.toFixed(2).toString()
      
      //Element custom Style
      el.style.backgroundColor = makerColor(averageRiskRate).marker
      el.style.color = makerColor(averageRiskRate).text
      

      el.addEventListener('click',()=>{
        dispatch(updateFilteredAssets(markerPoint.assets))
        mapboxMap.easeTo({
          center:markerPoint.coords,
          zoom:9
        })
      })

      // create the popup
      const popup = new mapboxgl.Popup({ offset:10 }).setHTML(
        `<p>Number of assets: ${markerPoint.assets.length}</p>`
        );

      //Change the cursor everytime the user hover a marker
      el.addEventListener('mouseenter',()=>{
        el.style.cursor = 'pointer'
      })

      //crate the market in the map
      new mapboxgl.Marker({
        element: el
      })
      .setLngLat(markerPoint.coords)
      .setPopup(popup)
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