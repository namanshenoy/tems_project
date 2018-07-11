export default {
  Query: {
    getFaultById: (parent, {id}, {models}) => models.Fault.findById(id) 
  },
  Mutation: {
    //testerId: Int!, faultNumber: Int!, monitor: Int!, value: Int!, date: String!
    createFault: async (parent, {testerId, faultNumber, monitor, value, date}, {models}) => {
     try {
      var f = await models.Fault.create({faultNumber, monitor, value, date:new Date(date)})
      models.Tester.findOne({where: {id: testerId}}).then(t => {
        t.addFaults(f)
      })
      return true
     }
     catch (err) {
       console.log("Error in mutation: createFault")
       console.log(err)
       return false
     }
    }
  }
}