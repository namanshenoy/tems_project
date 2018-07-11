export default {
  Query: {
    // getSlot(tester: Tester!, slotNumber: Int!): Slot!
    // getAllSlots(tester: Tester!): [Slot!]!
    getSlot: (parent, { slotNumber, testerId }, { models }) => {
      try {
        return models.Slot.findOne({
          where: {
            tester_id: testerId,
            slot_number: slotNumber,
          },
        })
      } catch (err) {
        console.log('Error getting slot: ', err)
        return null
      }
    },
  },
  Mutation: {
    createSlot: async (parent, { slotNumber, testerId }, { models }) => {
      try {
        const newSlot = await models.Slot.create({ slotNumber, testerId })
        models.Tester.findOne({ where: { id: testerId } }).then((t) => {
          t.addSlots(newSlot).then((t1) => {
            console.log('Creted new slot! New Tester: ', t1.getSlots().then((ts) => {
              console.log(ts)
            }))
          })
        })
        return newSlot
      } catch (err) {
        console.log('Error in mutation: createSlot')
        console.log(err)
        return null
      }
    },
  },
}
