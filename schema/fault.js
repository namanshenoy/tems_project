export default `
  type Fault{
    id: Int!
    faultNumber: Int!
    monitor: Int!
    value: Int!
    date: String!
  }

  type Query{
    getFaultById(id: Int!): Fault
  }

  type Mutation{
    createFault(testerId: Int!, faultNumber: Int!, monitor: Int!, value: Int!, date: String!): Boolean!
  }
`