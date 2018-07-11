import axios from 'axios'

const helpers  = {
  graphqlQuery : (host, PORT, graphqlEndpoint, query) =>{
    /*const query = `
      {
        getTesterById(id:1) {
          id
          name
        }
      }
    `*/
    return axios.post(`${host}:${PORT}${graphqlEndpoint}`, {
        query
      })
  }
}

export default helpers