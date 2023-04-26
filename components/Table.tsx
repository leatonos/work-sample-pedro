import * as React from 'react'
import { Asset } from "../interfaces";

type tableProps = {
    assets: Asset[] 
  }

const Table = ({assets}: tableProps) => {

    
    React.useEffect(()=>{
        if (typeof window === "undefined") return;
    })

    /*
    
        {assets.map((asset,index)=>{
      const riskFactors = JSON.parse(asset.riskFactors)

      let riskFactorsArr: string[] = []

      for(const property in riskFactors){
        riskFactorsArr.push(`${property} ${riskFactors[property]} `)
      }
     
      return(
        <tr>
          <td>{asset.assetName}</td>
          <td>{asset.lat}</td>
          <td>{asset.long}</td>
          <td>{asset.businessCategory}</td>
          <td>{asset.riskRating}</td>
          <td></td>
          <td>{asset.year}</td>
        </tr>
      )
    }
    )
    
    }
    
    */

    return(
        <div>

    <table>
        <thead>
            <th>Asset Name</th>
            <th>Lat</th>
            <th>Long</th>
            <th>Business Category</th>
            <th>Risk Rating</th>
            <th>Risk Factors</th>
            <th>Year</th>
        </thead>
        
    </table>
        </div>
)

}

export default Table
