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

console.log('Drop Database: ', dbRefresh)

// Server Root
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello there, General Kenobi!',
  })
})

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

// TEMS INITIALIZATION message handler
app.post('/TEST_CELL/:testerName/INITIALIZATION', (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)
})

// TEMS CONFIGURATION message handler
app.post('/TEST_CELL/:testerName/CONFIGURATION', (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)

  // foreach board, create a slot, add the board to the slot.
  // Gather the set of boards, then add it as a set to the tester with Tester.setSlots
  const testerPromise = helpers.upsert(models.Tester, {
    name: req.params.testerName,
  },
  {
    name: req.params.testerName,
  })
  Promise.resolve(testerPromise).then((testerObject) => {
    testerObject.update({
      name: req.params.testerName,
      igxlVersion: req.body.TESTER_CONTROLLER_SW.Version,
      model: req.body.TESTER_MODEL,
    }).then((updatedTesterObject) => {
      req.body.BOARD.forEach(async (configBoard) => {
        const slotPromise = helpers.upsert(models.Slot, {
          slotNumber: configBoard.SLOT,
        }, {
          tester_id: updatedTesterObject.id, slotNumber: configBoard.SLOT,
        })
        Promise.resolve(slotPromise)
          .then((slotObject) => {
            // console.log('Inserting Slot: ', configBoard.SLOT)
            const boardPromise = helpers.upsert(models.Board, {
              boardId: configBoard.BOARD_ID,
              name: configBoard.NAME,
              partNumber: configBoard.PART_NUMBER,
              rev: configBoard.REV,
              sector: configBoard.SECTOR,
              slotNumber: configBoard.SLOT,
            },
            {
              boardId: configBoard.BOARD_ID,
              name: configBoard.NAME,
              partNumber: configBoard.PART_NUMBER,
              rev: configBoard.REV,
              sector: configBoard.SECTOR,
              slotNumber: configBoard.SLOT,
            })
            Promise.resolve(boardPromise)
              .then((boardObject) => {
                // console.log('Inserting board for: ', slotObject.slotNumber, 'as',
                // boardObject.slotNumber)
                slotObject.addBoards(boardObject).then(() => {
                  updatedTesterObject.addSlots(slotObject)
                  // .then(() => console.log('Added Slot for Tester:',
                  // updatedTesterObject.name, 'as', slotObject.id))
                })
              })
              .catch(error => console.log('Error inserting board in slot', slotObject.slotNumber, 'as slot id:', slotObject.id, '\n', error))
          })
          .catch(error => console.log('Error inserting board in tester', testerObject.name, 'as slot:', configBoard.SLOT, '\n', error))
      })
    })
  })
})

// TEMS STATUS message handler
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

// if force is true, the database will be empty upon server start
models.sequelize.sync({ force: dbRefresh }).then(() => {
  // Start server
  app.listen(PORT, '0.0.0.0')
  console.log(`App is listening at port ${PORT}`)
})
