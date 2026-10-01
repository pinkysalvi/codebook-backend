import express from 'express'
import jsonServer from 'json-server'
import auth from 'json-server-auth'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const server = express()
const router = jsonServer.router(path.join(directory, 'data', 'db.json'))
const api = express.Router()

server.db = router.db

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }

    next()
})
server.use(jsonServer.defaults())
server.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

api.use(auth.rewriter({
    products: 444,
    featured_products: 444,
    orders: 660,
    users: 600,
}))
api.use(auth)
api.use(router)
server.use('/api', api)
server.use(api)

const port = Number(process.env.PORT) || 8000

server.listen(port, () => {
    console.log(`Codebook mock API is running at http://localhost:${port}`)
})
