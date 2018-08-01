import moment from 'moment'
import models from '../models'
import Helpers from '../helpers'

/**
 * Controller for Maintenace TEMS Message.
 * Creates/Updates a Tester with the given information
 * Maintenance message has 2 types:
 *  <ul>
 *  <li>SMC Data message: Contains list of Nodes, Monitors, Index and values
 *     , warnings and faults</li>
 *  <br>
 *  <li>Files: Contains data from Maintenance Data Files</li>
 *  </ul>
 * @module Controllers/maintenanceController
 */
const maintenanceController = {
  /**
   * Controller
   *
   * @memberof Controllers/maintenanceController.controller
   * @exports maintenanceController.controller
   * @method
   * @param  {Request} req - Incoming Request
   * @param  {Response} res - Outgoing Response
   */
  controller: (req, res) => {
    console.log(req.originalUrl)
    console.log('size', req.headers['content-length'])
    const smcData = maintenanceController.parseSMCData(req)
    console.log('Message Type', smcData.messageType)
    if (smcData.messageType === 'NodesAndMonitors') {
      res.sendStatus(200)
      maintenanceController.smcDataController(req.params.testerName, smcData)
    } else if (smcData.messageType === 'Warnings') {
      res.sendStatus(200)
      // console.log(JSON.stringify(smcData, null, 2))
      maintenanceController.warningDataController(req.params.testerName, smcData)
    } else {
      res.sendStatus(400)
    }
  },

  warningDataController: (testerName, smcData) => {
    console.log('Inserting Warnings for tester: ', testerName)
    maintenanceController.getTester(testerName)
      .then((testerObject) => {
        console.log(smcData)
        smcData.warningList.forEach((warning) => {
          console.log(warning)
          console.log(warning.datetime)
          models.Warning.create({
            message: warning.message,
            date: moment(warning.datetime).toDate(),
          }).then(createdWarning => testerObject.addWarnings(createdWarning))
        })
      })
  },

  smcDataController: (testerName, smcData) => {
    maintenanceController.getTester(testerName).then((testerObject) => {
      const upsertNodesPromises = maintenanceController.upsertNodes(smcData, testerObject)
      maintenanceController.destroyFaults(testerObject)
      Promise.all(upsertNodesPromises)
        .then((allSlots) => {
          const slotIdToSlotMap = maintenanceController.createSlotIdToSlotMap(allSlots)
          maintenanceController.createMonitorsAndFaults(smcData, testerObject, slotIdToSlotMap)
        })
        .catch(error => console.log('Error in maintenance controller:\n', error))
    })
  },

  parseSMCData: req => JSON.parse(req.body.MAINT_DESCRIPTION_LIST),

  getTester: (testerName) => {
    console.log(testerName)
    return models.Tester.findOne({ name: testerName })
  },
  upsertNodes: (smcData, testerObject) => {
    const nodeUpsertPromises = []
    smcData.nodes.forEach((node) => {
      // console.log(testerObject)
      // console.log('Inserting Slot for tester: ', testerObject.id)
      node.tester_id = testerObject.id // eslint-disable-line no-param-reassign
      const nodeUpsertPromise = Helpers.upsert(models.Slot, node, {
        tester_id: testerObject.id,
        slotNumber: node.slotNumber,
      })
      nodeUpsertPromises.push(
        nodeUpsertPromise,
      )
    })
    return nodeUpsertPromises
  },

  createSlotIdToSlotMap: (allSlots) => {
    const slotIdToSlotMap = []
    allSlots.forEach((slot) => {
      Promise.resolve(models.Monitor.destroy({ where: { slot_id: slot.id } }))
      slotIdToSlotMap[slot.slotNumber] = slot
    })
    return slotIdToSlotMap
  },

  destroyFaults: testerObject => models.Fault.destroy({ where: { tester_id: testerObject.id } }),

  createFaults: (testerObject, faultArray) => {
    faultArray.forEach((fault) => {
      models.Fault.create({
        faultNum: fault.fault_num,
        faultVal: fault.fault_val,
        indexNum: fault.index_num,
        slotNum: fault.slot_num,
        faultDate: new Date(fault.fault_date),
      })
        .then(createdFault => testerObject.addFaults(createdFault))
        .error(error => console.log('Error creating fault\n', error))
    })
  },

  createMonitorsAndFaults: (smcData, testerObject, slotIdToSlotMap) => {
    smcData.monitorsCached.forEach((monitor) => {
      maintenanceController.createFaults(testerObject, JSON.parse(monitor.faults))
      models.Monitor.create({
        index: monitor.index,
        value: monitor.value,
        unit: monitor.unit,
        name: monitor.name,
        asterix: monitor.asterix,
      })
        .then((createdMonitor) => {
          slotIdToSlotMap[monitor.node].addMonitors(createdMonitor)
        })
        .catch(error => console.log('Error creating monitor\n', error))
    })
  },
}

export default maintenanceController.controller
