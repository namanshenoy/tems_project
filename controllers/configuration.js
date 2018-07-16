import Promise from 'bluebird'
import models from '../models'
import Helpers from '../helpers'

/**
 * Controller for Configuration TEMS Message.
 * Creates/Updates a Tester with the given information
 * Configuration message includes boards and slots
 *
 * @method configurationController
 * @memberof Controllers
 * @param  {Request} req - Incoming Request
 * @param  {Response} res - Outgoing Response
 */
const configurationController = (req, res) => {
  Promise.longStackTraces()

  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)

  // foreach board, create a slot, add the board to the slot.
  // Gather the set of boards, then add it as a set to the tester with Tester.setSlots
  const testerPromise = Helpers.upsert(models.Tester, {
    name: req.params.testerName,
  },
  {
    name: req.params.testerName,
  })

  Promise.resolve(testerPromise)
    .then(testerObject => testerObject.update({
      name: req.params.testerName,
      igxlVersion: req.body.TESTER_CONTROLLER_SW.Version,
      model: req.body.TESTER_MODEL,
    })
      .then((updatedTesterObject) => {
        req.body.BOARD.forEach((configBoard) => {
          const slotPromise = Helpers.upsert(models.Slot, {
            slotNumber: configBoard.SLOT,
          }, {
            tester_id: updatedTesterObject.id, slotNumber: configBoard.SLOT,
          })
          Promise.resolve(slotPromise)
            .then((slotObject) => {
              // console.log('Inserting Slot: ', configBoard.SLOT)
              const boardPromise = Helpers.upsert(models.Board, {
                boardId: configBoard.BOARD_ID,
                name: configBoard.NAME,
                partNumber: configBoard.PART_NUMBER,
                rev: configBoard.REV,
                sector: configBoard.SECTOR,
                slotNumber: configBoard.SLOT,
                testerName: req.params.testerName,
              },
              {
                slotNumber: configBoard.SLOT,
                testerName: req.params.testerName,
              })
              Promise.resolve(boardPromise)
                .then((boardObject) => {
                  slotObject.addBoards(boardObject)
                    .then(() => updatedTesterObject.addSlots(slotObject))
                    .catch(error => console.log('Error updating slots\n', error))
                })
                .catch(error => console.log('Error inserting board in slot', slotObject.slotNumber, 'as slot id:', slotObject.id, '\n', error))
              return null
            })
            .catch(error => console.log('Error inserting board in the tester', testerObject.name, 'as slot:', configBoard.SLOT, '\n', error))
        })
        return null
      })
      .catch(error => console.log('Error retrieving tester\n', error)))
    .catch(error => console.log('Error\n', error))
}

export default configurationController
