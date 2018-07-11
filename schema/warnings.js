export default `
  type Warning{
    id: Int!,
    message: String!,
    date: String
  }

  type Query{
    getWarningById(id: Int!): Warning
  }

  type Mutation{
    createWarning(testerId: Int!, message: String!, date: String!): Boolean!
  }
`