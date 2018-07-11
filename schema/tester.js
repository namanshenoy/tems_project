export default `
type Tester{
  id: Int!
  name: String!
  Slots: [Slot]!
  igxlVersion: String
  Faults: [Fault]
  Warnings: [Warning]
  status: String
  model: String
}

type Query {
# Tester Meta
  getTesterById(id: Int!): Tester
  getTesterByName(name: String!): Tester
  getAllTesters: [Tester]
}

type Mutation {
# Tester Meta
  createTester(name: String!, igxlVersion: String, model: String): Tester!
  updateTester(name: String!, status:String, igxlVersion: String, model: String): Boolean!
  setTesterStatus(status: String!, name: String!): Boolean!

# Tester Slots
  addTesterSlot(slotId: Int!, testerName: String!): Boolean!
  removeTesterSlot(slotId: Int!, testerName: String!): Boolean!

# Tester Warnings
  addTesterSingleWarning(name: String!, message: String!, date: String!): Boolean!
  addTesterBatchWarnings(name: String!, warnings: [String!]!): Boolean!
}
`