export default `
  type Board{
    id: Int!
    boardId: String!
  }

  type Query{
    getBoardById(id: Int!): Board
  }

  type Mutation{
    createBoard(testerId: Int!, slotId: Int!, boardId: String!): Boolean!
  }
`