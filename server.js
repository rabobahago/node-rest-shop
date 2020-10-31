const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(port)

// password: O5RAJkusB5cDQoWQ
// id: mongodb+srv://<username>:<password>@cluster0.ml1qu.mongodb.net/<dbname>?retryWrites=true&w=majority
