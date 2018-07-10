export default {
  Query: {
    getTesterById: (parent, {id}, {models}) => models.Tester.findOne({where:{id}}),

    getTesterByName: (parent, {name}, {models}) => models.Tester.findOne({where: {name}}),

    getAllTesters: (parent, args, {models}) => models.Tester.findAll(),

    getSlotsForTester:async (parent, {testerName}, {models}) => {
      try {
        var t = await models.Tester.findOne({where: {name: testerName}})
        return t.getSlots()
      } catch (err) {
        console.log("Error at getSlotsForTester")
        console.log(err)
      }
    }
  },
  Mutation: {
    createTester: (parent, args, {models}) => models.Tester.create(args) ,

    addSlot: async (parent, {slotId, testerName}, {models}) => {
      try {
        var s = await models.Slot.findOne({where: {id: slotId}})
        var t = await models.Tester.findOne({where: {name: testerName}}).then(t=>{
          t.addSlots(s)
        })
        return true
      }
      catch(err){
        console.log('Error adding slot')
        console.log(err)
        return false
      }
    },

    removeSlot: async (parent, {slotId}, {models}) => {
      try {
        var s = await models.Slot.findOne({where: {id: slotId}})
        var t = await models.Tester.findOne({where: {testerName: testerName}}).then(t=>{
          t.removeSlots(s).then(s1 => console.log(`Successfully Removed Slot ${s1.slotNumber} from Tester ${testerName}`))
        })
        return true
      }
      catch (err) {
        console.log('Error removing slot')
        console.log(err)
        return false
      }
    }
  }
}