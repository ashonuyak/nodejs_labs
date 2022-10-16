import http from 'http'
// Read Environment Parameters
const port = Number(process.env.PORT) || 3001
const greeting = 'Good evening, Mr Nosov'
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end(`${greeting}\n`)
})
server.listen(port)
