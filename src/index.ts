import router from './routes/index.js'
import Server from './server.js'

const PORT = parseInt(process.env.PORT || '8080', 10)

const server = new Server()

server.use(router).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
