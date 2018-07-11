export default {
  Query: {
    getMonitorById: (parent, { id }, { models }) => models.Monitor.findById(id),
  },
  Mutation: {
    // testerId: Int!, faultNumber: Int!, monitor: Int!, value: Int!, date: String!
    createMonitor: async (parent, {
      slotId, index, value, monitor, unit, name,
    }, { models }) => {
      try {
        const m = await models.Monitor.create({
          index, value, monitor, unit, name,
        })
        models.Slot.findOne({ where: { id: slotId } }).then((s) => {
          s.addMonitors(m)
        })
        return true
      } catch (err) {
        console.log('Error in mutation: createMonitor')
        console.log(err)
        return false
      }
    },
  },
}
