import helpers from '../helpers'
import config from '../config'

const statusController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)

  helpers.graphqlQuery(config.graphqlHost, config.PORT, config.graphqlEndpoint,
    `mutation {
      updateStatus:setTesterStatus(name:"${req.params.testerName}", status:"${req.body.STATUS}")
    }`)
    .then((response) => {
      const updated = response.data.data.updateStatus

      if (!updated) {
        console.log('Updated ', req.params.testerName, ',', updated)
        helpers.createTesterKWargs(config.graphqlHost, config.PORT, config.graphqlEndpoint, {
          name: req.params.testerName, status: req.body.STATUS,
        })
      }
    })
    .catch(err => console.log('Error in Status API!\n', err))
}

export default statusController
