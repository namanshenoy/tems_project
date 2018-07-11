export default {
  Query: {
    // Tester Meta
    getTesterById: (parent, {id}, {models}) =>   models.Tester.findById(id, {
      include: [
        {
          model: models.Slot, as: 'Slots',
          include: [
            { model: models.Board, as: 'Boards' },
            { model: models.Monitor, as: 'Monitors' }
          ]
        },
        { 
          model: models.Warning,
          as: 'Warnings'
        },
        { 
          model: models.Fault,
          as: 'Faults'
        },
    ]
    }),

    getTesterByName: (parent, {name}, {models}) => models.Tester.findOne({where: {name}, 
      include: [
        {
          model: models.Slot, as: 'Slots',
          include: [
            { model: models.Board, as: 'Boards' },
            { model: models.Monitor, as: 'Monitors' }
          ]
        },
        { 
          model: models.Warning,
          as: 'Warnings'
        },
        { 
          model: models.Fault,
          as: 'Faults'
        },
      ]
    }
    ),

    getAllTesters: (parent, args, {models}) => models.Tester.findAll(),
  },
  Mutation: {
    // Tester Meta
    createTester: (parent, args, {models}) => models.Tester.create(args),

    updateTester: async (parent, args, {models}) => {
      try {
        await models.Tester.update({...args}, {where: {name:args.name}})
        return true
      }
      catch(err){
        console.log("Could not update tester!")
        console.log(err)
        return false
      }
    },

    setTesterStatus: async (parent, {status, name}, {models}) =>{
      try {
        var t = await models.Tester.update(
          {status},
          {where: {name},
         },
        )
        return t[0] == 1
      }
      catch(err){
        console.log("Could not set tester status!")
        console.log(err)
        return false
      }
    },

    // Tester Slot Mutations
    addTesterSlot: async (parent, {slotId, testerName}, {models}) => {
      try {
        var s = await models.Slot.findOne({where: {id: slotId}})
        var t = await models.Tester.findOne({where: {name: testerName}}).then(t=>{
          t.addSlots(s)
        })
        return true
      }
      catch(err) {
        console.log('Error adding slot')
        console.log(err)
        return false
      }
    },

    removeTesterSlot: async (parent, {slotId, testerName}, {models}) => {
      try {
        var s = await models.Slot.findOne({where: {id: slotId}})
        models.Tester.findOne({where: {testerName: testerName}}).then(t=>{
          t.removeSlots(s).then(s1 => console.log(`Successfully Removed Slot ${s1.slotNumber} from Tester ${testerName}`))
        })
        return true
      }
      catch (err) {
        console.log('Error removing slot')
        console.log(err)
        return false
      }
    },

    // Tester Slot Mutations
    addTesterSingleWarning: async (parent, {name, message, date}, {models}) => {
      try {
        var t = await  models.Tester.findOne({where: {name}}).then(async t => {
          var w = await models.Warning.create({message, date: new Date(date).toISOString()})
          t.addWarnings(w)
        })
        return true
      }
      catch(err) {
        console.log('Error adding slot')
        console.log(err)
        return false
      }
    },
    addTesterBatchWarnings: async (parent, {name, warningsArr}, {models}) => {
      try {
        var t = await models.Tester.findOne({where: {name}}).then( t => {
          warningsArr.forEach(async wStr => {
            var wObj = JSON.parse(wStr)
            var w = await models.Warning.create({message: wObj.message, date: new Date(wObj.date).toISOString()})
            t.addWarnings(w)
          })
        })
        return true
      }
      catch(err) {
        console.log('Error adding slot')
        console.log(err)
        return false
      }
    },
  }
}