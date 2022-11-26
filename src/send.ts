import { ServerResponse } from 'http'

import safeJSON from './utils.js'

const formatResponse: {
  [key in string]: (data: unknown) => {
    formattedData: unknown
    contentType: string
  }
} = {
  'text/plain': (text: unknown) => ({
    formattedData: text,
    contentType: 'text/plain',
  }),
  'application/json': (data: unknown) => ({
    formattedData: safeJSON(data as string),
    contentType: 'application/json',
  }),
  'application/x-www-form-urlencoded': (data: unknown) => ({
    formattedData: Object.fromEntries(new URLSearchParams(data as string)),
    contentType: 'application/xml',
  }),
}

export default async function send(
  res: ServerResponse,
  data: unknown,
  type: keyof typeof formatResponse = 'application/json',
  statusCode = 200,
): Promise<void> {
  if (!(type in formatResponse)) {
    console.log(`Unsupported response type: ${type}`)
    res.writeHead(500)
    return
  }

  res.setHeader('Content-Type', formatResponse[type](data).contentType)
  res.writeHead(statusCode)
  res.write(JSON.stringify(formatResponse[type](data).formattedData))
  res.end()
}
