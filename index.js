import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import models from './models'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const PORT = 8000
const app = express()

// bodyParser is needed just for POST.

app.get('/', function(req, res){
  res.status(200).send('Hello there General Kenobi!');
});

const graphqlEndpoint = '/graphql'

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

models.sequelize.sync({force:false }).then(data =>{
  app.listen(PORT)
  console.log(`App is listening at port ${PORT}`)
})
