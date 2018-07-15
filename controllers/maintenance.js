import models from '../models'
import Helpers from '../helpers'

/**
 * Controller for Maintenace TEMS Message.
 * Creates/Updates a Tester with the given information
 * Maintenance message has 2 types:
 *  <ul>
 *  <li>SMC Data message: Contains list of Nodes, Monitors, Index and values
 *     , warnings and faults</li?
 *  <br>
 *  <li>Files: Contains data from Maintenance Data Files</li>
 *  </ul>
 * @method maintenanceController
 * {@link Controllers.".maintenanceController"}
 * @memberof Controllers
 * @param  {Request} req - Incoming Request
 * @param  {Response} res - Outgoing Response
 */
const maintenanceController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  const smcData = JSON.parse(req.body.MAINT_DESCRIPTION_LIST)
  /**
   * Get current Tester Object
   */
  const nodePromises = []
  models.Tester.findOne({ name: req.params.testerName })
    .then((testerObject) => {
      /**
       * Create a map of Slot update
       */
      smcData.nodes.forEach((node) => {
        node.tester_id = testerObject.id // eslint-disable-line no-param-reassign
        nodePromises.push(
          Helpers.upsert(models.Slot, node, {
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
                testerObject.addFaults(createdFault)
              })
              .error(error => console.log('Error creating fault\n', error))
          })
          /**
           * Create monitor and add to Slot
           */
          models.Monitor.create({
            index: monitor.index,
            value: monitor.value,
            unit: monitor.unit,
            name: monitor.name,
            asterix: monitor.asterix,
          })
            .then((createdMonitor) => {
              Promise.resolve(nodeListObject[monitor.node].addMonitors(createdMonitor))
            })
            .catch(error => console.log('Error creating monitor\n', error))
        })
      })
    })
    .catch(error => console.log('Error generating node promises\n', error))
}

export default maintenanceController
