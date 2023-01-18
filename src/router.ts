import { IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'

import HttpMethodEnum from './http-method.enum.js'
import send from './send.js'

type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<void>

export default class {
  private handlers: { [path: string]: { [method: string]: Handler[] } } = {}

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = new URL(req.url || '/', `http://${req.headers.host}`).pathname
    const method = req.method || HttpMethodEnum.GET

    const routeHandlers = this.handlers[path]?.[method]
    if (!routeHandlers || routeHandlers.length === 0) {
      send(res, 'Not found', 'json', 404)
      return
    }

    for (const handler of await Promise.all(this.handlers[path][method])) {
      handler(req, res)
    }
  }

  add(method: HttpMethodEnum, path = '/', ...handlers: Handler[]): void {
    if (!this.handlers[path]?.[method]) {
      this.handlers[path] = {
        ...(this.handlers[path] || {}),
        [method]: [...handlers],
      }
    } else this.handlers[path][method].push(...handlers)
  }

  get(path = '/', ...handlers: Handler[]): void {
    this.add(HttpMethodEnum.GET, path, ...handlers)
  }

  post(path = '/', ...handlers: Handler[]): void {
    this.add(HttpMethodEnum.POST, path, ...handlers)
  }

  options(path = '/', ...handlers: Handler[]): void {
    this.add(HttpMethodEnum.OPTIONS, path, ...handlers)
  }
}
