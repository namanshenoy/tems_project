export default `
type Slot{
  id: Int!
  slotNumber: Int!
  tester_id: Int
}

type Query{
  getSlot(testerId: Int!, slotNumber: Int!): Slot!
}

type Mutation{
  createSlot(slotNumber: Int!, testerId: Int!): Slot!
}
`