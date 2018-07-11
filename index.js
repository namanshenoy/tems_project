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
  resolvers
})

const PORT = 8000
const app = express()

const graphqlEndpoint = '/graphql'
const host = 'http://localhost'

// Graph QL Endpoints
// bodyParser is needed just for POST.

app.get('/', function(req, res){
  res.status(200).send('Hello there General Kenobi!');
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress({ 
  schema,
  context: {
    models,
    tester: {
      id: 1
    } 
  }
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint}))

// Non GraphQL Endpoints
// http://localhost:8080/api/
app.post('/TEST_CELL/:testerName/INITIALIZATION', (req, res) => {
  console.log(req.originalUrl);
  res.sendStatus(200)
  console.log("Tester: " + req.params.testerName)
  console.log(res.body)
  //  updateTester(name: String!, status:String, igxlVersion: String, model: String): Boolean!
})

app.post('/TEST_CELL/:testerName/CONFIGURATION', (req, res) => {
  console.log(req.originalUrl);
  res.sendStatus(200)
  console.log("Tester: " + req.params.testerName)

  helpers.graphqlQuery(host, PORT, graphqlEndpoint, 
    `mutation {
      updateTester: updateTester(name:"${req.params.testerName}", igxlVersion:"${req.body.TESTER_CONTROLLER_SW.Version}", model:"${req.body.TESTER_MODEL}")
    }`
  )
  .then(response => {
    const updated = response.data.data.updateTester
  })
  .catch(error=>{
    console.log("Error found in CONFIGURATION endpoint!\n", error)
  })
})

app.post('/TEST_CELL/:testerName/STATUS', (req, res) => {
  console.log(req.originalUrl);
  res.sendStatus(200)
  helpers.graphqlQuery(host, PORT, graphqlEndpoint, 
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`
  )
    .then(response =>{
      const updated = response.data.data.updateStatus
      // console.log("Was " + req.params.testerName + " updated? " + updated)
      if (!updated){
        helpers.createTester(host, PORT, graphqlEndpoint, req.params.testerName)
      }
    })
    .catch(err => console.log("Error in Status API!\n", err))
})


models.sequelize.sync({force: true }).then(data =>{
  app.listen(PORT, '0.0.0.0')
  console.log(`App is listening at port ${PORT}`)
})
