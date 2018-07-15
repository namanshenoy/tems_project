import Helpers from '../helpers'
import config from '../config'

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

  Helpers.graphqlQuery(config.graphqlHost, config.PORT, config.graphqlEndpoint,
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`)
    .then((response) => {
      const updated = response.data.data.updateStatus

      if (!updated) {
        console.log('Updated ', req.params.testerName, ',', updated)
        Helpers.createTesterKWargs(config.graphqlHost, config.PORT, config.graphqlEndpoint, {
          name: req.params.testerName, status: req.body.STATUS,
        })
      }
    })
    .catch(err => console.log('Error in Status API!\n', err))
}

export default statusController
