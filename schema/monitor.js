export default `
  type Monitor{
    id: Int!
    index: Int!
    value: Int!
    unit: String!
    name: String!

  }

  type Query{
    getMonitorById(id: Int!): Monitor
  }

  type Mutation{
    createMonitor(slotId: Int!, index: Int!, value: Int!, unit: String!, name: String!): Boolean!
  }
`