import models from '../models'
import helpers from '../helpers'

const maintenanceController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)

  // foreach board, create a slot, add the board to the slot.
  // Gather the set of boards, then add it as a set to the tester with Tester.setSlots
  const testerPromise = helpers.upsert(models.Tester, {
    name: req.params.testerName,
  },
  {
    name: req.params.testerName,
  })

  /**
   * Promise for current tester
   */
  Promise.resolve(testerPromise)
    .then((testerObject) => {
      testerObject.update({
        name: req.params.testerName,
        igxlVersion: req.body.TESTER_CONTROLLER_SW.Version,
        model: req.body.TESTER_MODEL,
      })
        .then((updatedTesterObject) => {
          /**
           * Go though the boards from the request andreate an object
           * where I can map the slot to it's slot name without searching.
           * O(n) for object creation, O(1) for Slot retrieval after
           * Otheriwise, retrieving slots are an O(n^2) operation
           */
          req.body.BOARD.forEach((currentBoard) => {
            /**
             * Upsert the slot found from the Board
             * Checking wether the slot exists and
             * upserting costs the same time
             */
            const slotPromise = helpers.upsert(models.Slot, {
              slotNumber: currentBoard.SLOT,
            }, {
              tester_id: updatedTesterObject.id, slotNumber: currentBoard.SLOT,
            })

            /**
             * Retrieve slot that was upserted (slotObject)
             */
            Promise.resolve(slotPromise)
              .then((slotObject) => {
                /**
                 * Upsert current board (currentBoard)
                 */
                const boardPromise = helpers.upsert(models.Board, {
                  boardId: currentBoard.BOARD_ID,
                  name: currentBoard.NAME,
                  partNumber: currentBoard.PART_NUMBER,
                  rev: currentBoard.REV,
                  sector: currentBoard.SECTOR,
                  slotNumber: currentBoard.SLOT,
                  testerName: req.params.testerName,
                },
                {
                  slotNumber: currentBoard.SLOT,
                  testerName: req.params.testerName,
                })

                /**
                 * Retrieve the board that was created
                 * into an object (boardObject)
                 */
                Promise.resolve(boardPromise)
                  .then((boardObject) => {
                    /**
                     * Add that board as one of the slot's (slotObject)
                     * boards (boardObject)
                     */
                    slotObject.addBoards(boardObject)
                      .then(() => {
                        /**
                         * Updated tester with updated slots
                         */
                        updatedTesterObject.addSlots(slotObject)
                      })
                      .catch(error => console.log('Error updating slots\n', error))
                  })
                  .catch(error => console.log('Error inserting board in slot', slotObject.slotNumber, 'as slot id:', slotObject.id, '\n', error))
              })
              .catch(error => console.log('Error inserting board in tester', testerObject.name, 'as slot:', currentBoard.SLOT, '\n', error))
          })
        })
        .catch(error => console.log('Error retrieving tester\n', error))
    })
    .catch(error => console.log('Error\n', error))
}

export default maintenanceController
