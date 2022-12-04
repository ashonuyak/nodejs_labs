import { ServerResponse } from 'http'

import utils from './utils.js'

export default async function send(
  res: ServerResponse,
  data: unknown,
  type: keyof typeof utils.formatResponse = 'application/json',
  statusCode = 200,
): Promise<void> {
  if (!(type in utils.formatResponse)) {
    console.log(`Unsupported response type: ${type}`)
    res.writeHead(500)
    return
  }

  res.setHeader('Content-Type', utils.formatResponse[type](data).contentType)
  res.writeHead(statusCode)
  res.write(JSON.stringify(utils.formatResponse[type](data).formattedData))
  res.end()
}
