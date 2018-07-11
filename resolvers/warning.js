export default {
  Query: {
    getWarningById: (parent, { id }, { models }) => models.Warning.findById(id),
  },
  Mutation: {
    createWarning: async (parent, { testerId, message, date }, { models }) => {
      try {
        const w = await models.Warning.create({ message, date: new Date(date) })
        models.Tester.findOne({ where: { id: testerId } }).then((t) => {
          t.addWarnings(w)
        })
        return true
      } catch (err) {
        console.log('Error in mutation: createFault')
        console.log(err)
        return false
      }
    },
  },
}
