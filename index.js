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
})

app.post('/TEST_CELL/:testerName/STATUS', (req, res) => {
  console.log(req.originalUrl);
  res.sendStatus(200)
  helpers.graphqlQuery(host, PORT, graphqlEndpoint, `
    {
      getTesterById(id:1) {
        id
        name
      }
    }
  `)
    .then(response => console.log(response.data))
    .catch(err => console.log("Error found!", error))
  console.log(req.body.STATUS)
})


models.sequelize.sync({force: false }).then(data =>{
  app.listen(PORT, '0.0.0.0')
  console.log(`App is listening at port ${PORT}`)
})
