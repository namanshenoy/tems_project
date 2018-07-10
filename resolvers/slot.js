export default {
  Query: {
    //getSlot(tester: Tester!, slotNumber: Int!): Slot!
    //getAllSlots(tester: Tester!): [Slot!]!
    getSlot:async (parent, {slotNumber}, {models, tester}) => {
      try{
        return models.findOne({
          where: {
            testerId: tester.id, 
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
    createSlot: async (parent, {slotNumber}, {models, tester}) => {
     try {
      var newSlot = await models.Slot.create({slotNumber , testerId: tester.id})
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