import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import controllers from './controllers'
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

/*
 * app setup
 */

// bodyParser is needed just for POST.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/*
 * Graph QL Endpoints
 */

// Check if in developer mode
if (process.env.node_env === 'development') {
  console.log('Development Mode: true')
}

console.log('Drop Database: ', config.dbRefresh)

// Server Root
app.get('/', controllers.home)

app.use(config.graphqlEndpoint, bodyParser.json(), graphqlExpress({
  schema,
  context: {
    models,
  },
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: config.graphqlEndpoint }))

/*
 * Non GraphQL Endpoints
 */

// TEMS INITIALIZATION message handler
app.post('/TEST_CELL/:testerName/INITIALIZATION', controllers.initialization)

// TEMS Maintenance Handler
app.post('/TEST_CELL/:testerName/MAINTENANCE', controllers.maintenance)

// TEMS CONFIGURATION message handler
app.post('/TEST_CELL/:testerName/CONFIGURATION', controllers.configuration)

// TEMS STATUS message handler
app.post('/TEST_CELL/:testerName/STATUS', controllers.status)

// if force is true, the database will be empty upon server start
models.sequelize.sync({ force: config.dbRefresh }).then(() => {
  // Start server
  app.listen(config.PORT, config.host)
  console.log(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`)
  console.log(`App is listening at host ${config.host} port ${config.PORT}`)
})
