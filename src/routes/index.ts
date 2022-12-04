import Router from '../router.js'
import send from '../send.js'
import utils from '../utils.js'

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

router.get('/echo', (_req, res) => {
  const echoData = utils.getEchoData(_req)
  send(res, echoData)
})

router.post('/echo', (_req, res) => {
  _req.setEncoding('utf8')
  _req.on('data', (data) => {
    const echoData = utils.getEchoData(_req, data)
    send(res, echoData, _req.headers['content-type']?.split(';')[0])
  })
})

export default router
