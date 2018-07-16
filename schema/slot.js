export default `
type Slot{
  id: Int!
  slotNumber: Int!
  neuronId: String
  eepromData: String
  swRevDate: String
  limitRevDate: String
  limitFileName: String
  tester_id: Int
  Boards: [Board!]
  Monitors: [Monitor!]
}

type Query{
  getSlot(testerId: Int!, slotNumber: Int!): Slot!
}

type Mutation{
  createSlot(slotNumber: Int!, testerId: Int!): Slot!
}
`
