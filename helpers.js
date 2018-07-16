import axios from 'axios'
import util from 'util'
import config from './config'

/**
 * Namespace containing different types of helper functions
 * @namespace Helpers
 */
const Helpers = {
  /**
   * Runs a query to the GraphQL Endpoint
   * Refer to this by {@link Helpers.".graphqlQuery"}
   * @method graphqlQuery
   * @memberof Helpers
   * @param  {string} query - Query as a string
   * @returns {Promise} Returns Promise containing query reply
   */
  graphqlQuery: query => axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`,
    {
      query,
    }),

  /**
   * Creates a Tester via GraphQL endpoint
   * Refer to this by {@link Helpers.".createTester"}
   * @method createTester
   * @memberof Helpers
   * @param  {string} testerName -Tester's name
   */
  createTester: (testerName) => {
    axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`, {
      query:
        `mutation {
            created:createTester(name:"${testerName}"){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', testerName))
      .catch(err => console.log('Error creating tester in Helpers!\n', err.response.data))
  },

  /**
   * Creates a Tester via GraphQL endpoint with kwargs
   * Refer to this by {@link Helpers.".createTester"}
   * @method createTester
   * @memberof MyNamespace
   * @param  {Object} args - Set of attributes for the tester
   */
  createTesterKWargs: (args) => {
    let argString = util.inspect(args)
    argString = argString.replace(/[']/g, '"').replace(/[{}\n]|/g, '')
    console.log('ARG STRING: ', argString)
    axios.post(`${config.graphqlHost}:${config.PORT}${config.graphqlEndpoint}`, {
      query:
        `mutation {
            created:createTester(${argString}){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', args))
      .catch(err => console.log('Error creating tester in Helpers!\n', err.response.data))
  },
  /**
   * Update or Insert into database based on conditions
   * @method upsert
   * @memberof Helpers
   * @param  {Model} model - Model of the insert/update item
   * @param  {Object} values - Attributes for the insert/update item
   * @param  {Object} condition - Sequelize where conditions for when to insert/update item
   * @return {Promise} Promise containing the updated item(s)
   */
  upsert: (model, values, condition) => (model)
    .findOne({ where: condition })
    .then((obj) => {
      if (obj) {
        // update
        return obj.update(values)
      }
      // insert
      return model.create(values)
    }),
}

export default Helpers
