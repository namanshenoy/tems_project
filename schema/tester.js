export default `
type Tester{
  id: Int!,
  slots: [Slot!]!,
  igxlVersion: String,
  name: String!
}

type Query {
  getTesterById(id: Int!): Tester!
  getTesterByName(name: String!): Tester!
  getAllTesters: [Tester!]!
  getSlotsForTester(testerName: String!): [Slot!]!
}

type Mutation {
  createTester(name: String!, igxlVersion: String): Tester!
  addSlot(slotId: Int!, testerName: String!): Boolean!
  removeSlot(slotId: Int!, testerName: String!): Boolean!
}

`