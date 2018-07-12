import axios from 'axios'
import util from 'util'

const helpers = {
  graphqlQuery: (host, PORT, graphqlEndpoint, query) => axios.post(`${host}:${PORT}${graphqlEndpoint}`,
    {
      query,
    }),
  createTester: (host, PORT, graphqlEndpoint, testerName) => {
    axios.post(`${host}:${PORT}${graphqlEndpoint}`, {
      query:
          `mutation {
            created:createTester(name:"${testerName}"){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', testerName))
      .catch(err => console.log('Error creating tester in helpers!\n', err))
  },
  createTesterKWargs: (host, PORT, graphqlEndpoint, args) => {
    let argString = util.inspect(args)
    argString = argString.replace(/[']/g, '"').replace(/[{}\n]|/g, '')
    console.log('ARG STRING: ', argString)
    axios.post(`${host}:${PORT}${graphqlEndpoint}`, {
      query:
          `mutation {
            created:createTester(${argString}){id}
          }`,
    })
      .then(() => console.log('Created new tester: ', args))
      .catch(err => console.log('Error creating tester in helpers!\n', err.response.data))
  },
}

export default helpers
