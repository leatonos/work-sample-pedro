import { NextApiRequest, NextApiResponse } from 'next'
import { sampleUserData } from '../../../utils/sample-data'

const handler = async(_req: NextApiRequest, res: NextApiResponse) => {
  const fs = require('fs')
  const csv = require('fast-csv');
  const data = []

  await fs.createReadStream('./sample_data.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', (error: any) => console.error(error))
    .on('data', (row: any) => data.push(row))
    .on('end', () => res.status(200).json(data));
}

export default handler
