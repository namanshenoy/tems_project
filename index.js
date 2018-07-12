import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import models from './models'
import helpers from './helpers'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
const dbRefresh = false
const PORT = 8000
const app = express()

const graphqlEndpoint = '/graphql'
const host = 'http://localhost'

// Graph QL Endpoints
// bodyParser is needed just for POST.
console.log(process.env.node_env)

if (process.env.node_env === 'development') {
  console.log('Development Mode: true')
}

console.log('Drop Database: ', dbRefresh)

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello there, General Kenobi!',
  })
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress({
  schema,
  context: {
    models,
  },
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }))

/*
 * Non GraphQL Endpoints
 */
app.post('/TEST_CELL/:testerName/INITIALIZATION', (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)
})

app.post('/TEST_CELL/:testerName/CONFIGURATION', (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)

  helpers.graphqlQuery(host, PORT, graphqlEndpoint,
    `mutation {
      updateTester: updateTester(name:"${req.params.testerName}", igxlVersion:"${req.body.TESTER_CONTROLLER_SW.Version}", model:"${req.body.TESTER_MODEL}")
    }`)
    .then((response) => {
      const updated = response.data.data.updateTester
      console.log('Configuration Updated: ', updated)
    })
    .catch((err) => {
      console.log('Error found in CONFIGURATION endpoint!\n', err.data.errors)
    })
})

app.post('/TEST_CELL/:testerName/STATUS', (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  helpers.graphqlQuery(host, PORT, graphqlEndpoint,
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`)
    .then((response) => {
      const updated = response.data.data.updateStatus

      if (!updated) {
        console.log('Updated ', req.params.testerName, ',', updated)
        helpers.createTesterKWargs(host, PORT, graphqlEndpoint, {
          name: req.params.testerName, status: req.body.STATUS,
        })
      }
    })
    .catch(err => console.log('Error in Status API!\n', err))
})


models.sequelize.sync({ force: dbRefresh }).then(() => {
  app.listen(PORT, '0.0.0.0')
  console.log(`App is listening at port ${PORT}`)
})
