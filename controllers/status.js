import helpers from '../helpers'

/**
 * Controls messages recieved at the STATUS endpoint
 * @param {Request} req - Request from client
 * @param {Response} res - Request to client
 */
const statusController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  helpers.graphqlQuery(
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`,
  )
    .then((response) => {
      const updated = response.data.data.updateStatus

      if (!updated) {
        console.log('Updated ', req.params.testerName, ',', updated)
        helpers.createTesterKWargs({
          name: req.params.testerName, status: req.body.STATUS,
        })
      }
    })
    .catch(err => console.log('Error in Status API!\n', err))
}

export default statusController
