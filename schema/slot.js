export default `
type Slot{
  id: Int!,
  slotNumber: Int!
}

type Query{
  getSlot(testerId: Int!, slotNumber: Int!): Slot!
}

type Mutation{
  createSlot(slotNumber: Int!): Slot!
}
`