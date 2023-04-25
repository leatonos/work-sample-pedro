import * as React from 'react'
import { Asset } from "../interfaces";

type tableProps = {
    assets: Asset[] 
  }

const Table = ({assets}: tableProps) => (
    <table>
    <tr>
      <th>Asset Name</th>
      <th>Lat</th>
      <th>Long</th>
      <th>Business Category</th>
      <th>Risk Rating</th>
      <th>Risk Factors</th>
      <th>Year</th>
    </tr>
    {assets.map((asset)=>{
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
          <td>{riskFactorsArr.map((factor)=>
            <p>{factor}</p>
          )}</td>
          <td>{asset.year}</td>
        </tr>
      )
    }
    )}
  </table>
)

export default Table
