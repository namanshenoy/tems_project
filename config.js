const config = {
  host: '0.0.0.0',
  graphqlHost: 'http://localhost',
  PORT: '8000',
  graphqlEndpoint: '/graphql',
  database: {
    name: 'tems',
    username: 'postgres',
    password: 'postgres',
  },
  dbRefresh: false,
}

export default config
