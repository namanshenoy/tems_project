export default `
  type Board{
    id: Int!
    slotNumber: Int
    boardId: String!
    name: String
    partNumber: String
    rev: String
    sector: String
  }

  type Query{
    getBoardById(id: Int!): Board
  }

  type Mutation{
    createBoard(testerId: Int!, slotId: Int!, boardId: String!, name: String, partNumber: String, rev: String, sector: String): Boolean!
  }
`
