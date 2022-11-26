import Router from '../router.js'
import send from '../send.js'

const router = new Router()

router.get('/', (_req, res) => {
  send(res, { message: 'I am Get request' }, 'text/plain')
})

router.post('/', (_req, res) => {
  _req.setEncoding('utf8')
  _req.on('data', (data) => {
    send(res, data, _req.headers['content-type']?.split(';')[0])
  })
})

export default router
