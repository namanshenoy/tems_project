export default {
  Query: {
    getBoardById: (parent, {id}, {models}) => models.Board.findById(id) 
  },
  Mutation: {
    createBoard: async (parent, {testerId, slotId, boardId}, {models}) => {
     try {
      var b = await models.Board.create({boardId})
      models.Slot.findOne({where: {"tester_id": testerId, id: slotId}}).then(s => {
        s.addBoards(b)
      })
      return true
     }
     catch (err) {
       console.log("Error in mutation: createBoard")
       console.log(err)
       return false
     }
    }
  }
}