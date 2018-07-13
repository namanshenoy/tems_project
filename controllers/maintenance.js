import models from '../models'
import helpers from '../helpers'

const maintenanceController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  const smcData = JSON.parse(req.body.MAINT_DESCRIPTION_LIST)

  /**
   * List of Promises that need to be completed in order to
   * update the lot relations
   */
  const nodePromises = []

  /**
   * Get current Tester Object
   */
  models.Tester.findOne({ name: req.params.testerName })
    .then((testerObject) => {
      /**
       * Create a map of Slot update
       */
      smcData.nodes.forEach((node) => {
        node.tester_id = testerObject.id // eslint-disable-line no-param-reassign
        nodePromises.push(
          helpers.upsert(models.Slot, node, {
            tester_id: testerObject.id,
            slotNumber: node.slotNumber,
          }),
        )
      })

      /**
       * Drop old faults from tester
       */
      models.Fault.destroy({ where: { tester_id: testerObject.id } })

      /**
       * Create List of promises for slot creation
       */
      Promise.all(nodePromises).then((allSlots) => {
        const nodeListObject = {}
        allSlots.forEach((slot) => {
          Promise.resolve(models.Monitor.destroy({ where: { slot_id: slot.id } }))
          nodeListObject[slot.slotNumber] = slot
        })

        /**
         * Create Faults per monitor
         */
        smcData.monitorsCached.forEach((monitor) => {
          const faultArr = JSON.parse(monitor.faults)
          faultArr.forEach((fault) => {
            models.Fault.create({
              faultNum: fault.fault_num,
              faultVal: fault.fault_val,
              indexNum: fault.index_num,
              slotNum: fault.slot_num,
              faultDate: new Date(fault.fault_date),
            })
              .then((createdFault) => {
                /**
                 * Add created faults to the tester
                 */
                testerObject.addFaults(createdFault)
              })
              .error(error => console.log('Error creating fault\n', error))
          })

          /**
           * Create monitor
           */
          models.Monitor.create({
            index: monitor.index,
            value: monitor.value,
            unit: monitor.unit,
            name: monitor.name,
            asterix: monitor.asterix,
          })
            .then((createdMonitor) => {
              /**
               * Add created Monitor to Slot
               */
              Promise.resolve(nodeListObject[monitor.node].addMonitors(createdMonitor))
            })
            .catch(error => console.log('Error creating mointor\n', error))
        })
      })
    })
    .catch(error => console.log('Error generating node promises\n', error))
}

export default maintenanceController
