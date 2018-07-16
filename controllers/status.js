import Helpers from '../helpers'

/**
 * Controller for Status TEMS Message.
 * Creates/Updates a Tester with the given information
 * @method statusController
 * @memberof Controllers
 * @param  {Request} req
 * @param  {Response} res
 */
const statusController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  Helpers.graphqlQuery(
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`,
  )
    .then((response) => {
      const updated = response.data.data.updateStatus

      if (!updated) {
        console.log('Updated ', req.params.testerName, ',', updated)
        Helpers.createTesterKWargs({
          name: req.params.testerName, status: req.body.STATUS,
        })
      }
    })
    .catch(err => console.log('Error in Status API!\n', err))
}

export default statusController
