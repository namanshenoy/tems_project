import axios from 'axios'
import util from 'util'
import config from './config'

/**
 * Probably not going to comment this file.
 * The name of each function should be enough to know what it does.
 */

const helpers = {

/**
 * Queries the Graphql endpoint with plain query
 *
 * @method
 * @param {String} query - Query
 * @returns {Promise} containing response form Graphql Endpoint
 */
  graphqlQuery: (query) => {
    axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`,
      {
        query,
      })
  },

  /**
 * Queries the Graphql endpoint and creates a new tester
 *
 * @method
 * @param {String} testerName - Query
 * @returns {Promise} containing response form Graphql Endpoint
 */
  createTester: (testerName) => {
    axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`, {
      query:
          `mutation {
            created:createTester(name:"${testerName}"){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', testerName))
      .catch(err => console.log('Error creating tester in helpers!\n', err))
  },

  /**
 * Queries the Graphql endpoint and creates a new tester with args
 *
 * @method
 * @param {Object} args - Query
 * @returns {Promise} containing response form Graphql Endpoint
 */
  createTesterKWargs: (args) => {
    let argString = util.inspect(args)
    argString = argString.replace(/[']/g, '"').replace(/[{}\n]|/g, '')

    axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`, {
      query:
          `mutation {
            created:createTester(${argString}){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', args))
      .catch(err => console.log('Error creating tester in helpers!\n', err.response.data))
  },

  /**
 * Update or Insert into Database
 *
 * @method
 * @param {Model} model - type of model being inserted/updated
 * @param {Object} values - values of the inserted/updated
 * @returns {Promise} containing response containing the object(s)
 * that were updated
 */
  upsert: (model, values, condition) => model
    .findOne({ where: condition })
    .then((obj) => {
      if (obj) {
        return obj.update(values)
      }
      return model.create(values)
    }),
}

export default helpers
