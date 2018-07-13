export default `
  type Fault{
    id: Int!
    faultNum: Int
    indexNum: Int
    faultVal: Int
    slotNum: Int
    faultDate: String
  }

  type Query{
    getFaultById(id: Int!): Fault
  }

  type Mutation{
    createFault(testerId: Int!, faultNumber: Int!, monitor: Int!, value: Int!, date: String!): Boolean!
  }
`
