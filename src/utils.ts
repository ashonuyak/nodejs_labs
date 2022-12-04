import { IncomingMessage } from 'http'

import utils from './utils.js'

function safeJSON(data: string): JSON | string {
  try {
    return JSON.parse(data)
  } catch {
    return 'Invalid JSON'
  }
}

function getEchoData(req: IncomingMessage, data?: string): string {
  if (!req.url) return 'Invalid request'

  const reqUrl = new URL(req.url, `http://${req.headers.host}`)

  return JSON.stringify({
    url: reqUrl.href,
    args: Object.fromEntries(reqUrl.searchParams),
    headers: req.headers,
    data:
      data &&
      utils.formatResponse[
        req.headers['content-type']
          ? req.headers['content-type'].split(';')[0]
          : 'application/json'
      ](data).formattedData,
  })
}

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
    formattedData: utils.safeJSON(data as string),
    contentType: 'application/json',
  }),
  'application/x-www-form-urlencoded': (data: unknown) => ({
    formattedData: Object.fromEntries(new URLSearchParams(data as string)),
    contentType: 'application/xml',
  }),
  'application/xml': (data: unknown) => ({
    formattedData: data,
    contentType: 'application/xml',
  }),
}

export default { safeJSON, getEchoData, formatResponse }
