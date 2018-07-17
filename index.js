import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import Controllers from './controllers'
// import prettyjson from 'prettyjson'
import models from './models'
import config from './config'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = express()

/**
 * app setup
 */

// bodyParser is needed just for POST.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Check if in developer mode
if (process.env.node_env === 'development') {
  console.log('Development Mode: true')
}

console.log('Drop Database: ', config.dbRefresh)

// Server Root

app.use(config.graphqlEndpoint, cors(), bodyParser.json(), graphqlExpress({
  schema,
  context: {
    models,
  },
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: config.graphqlEndpoint }))

/**
* Non GraphQL Endpoints
*/

// Home
app.get('/', Controllers.home)

// TEMS INITIALIZATION message handler
app.post('/TEST_CELL/:testerName/INITIALIZATION', Controllers.initialization)

// TEMS Maintenance Handler
// This controller is different. Uses the functional programming I was learning.
app.post('/TEST_CELL/:testerName/MAINTENANCE', Controllers.maintenance)

// TEMS CONFIGURATION message handler
app.post('/TEST_CELL/:testerName/CONFIGURATION', Controllers.configuration)

// TEMS STATUS message handler
app.post('/TEST_CELL/:testerName/STATUS', Controllers.status)


/**
 * Server Startup
 * if force is true, the database will be empty upon server start
 */
models.sequelize.sync({ force: config.dbRefresh }).then(() => {
  // Start server
  app.listen(config.PORT, config.host)
  console.log(`Graphql Endpoint: ${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`)
  console.log(`App is listening at host ${config.host} port ${config.PORT}`)
})
