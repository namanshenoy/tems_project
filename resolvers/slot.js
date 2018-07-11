export default {
  Query: {
    //getSlot(tester: Tester!, slotNumber: Int!): Slot!
    //getAllSlots(tester: Tester!): [Slot!]!
    getSlot: async (parent, {slotNumber, testerId}, {models}) => {
      try{
        return models.findOne({
          where: {
            testerId, 
            slotNumber
          }
        })
      }
      catch(err){
        console.log(err)
        return 
      }
    }
  },
  Mutation: {
    createSlot: async (parent, {slotNumber, testerId}, {models, tester}) => {
     try {
      var newSlot = await models.Slot.create({slotNumber , testerId})
      return newSlot
     }
     catch (err) {
       console.log("Error in mutation: createSlot")
       console.log(err)
       return null
     }
    }
  }
}