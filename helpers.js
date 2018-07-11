import axios from 'axios'

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
}

export default helpers
