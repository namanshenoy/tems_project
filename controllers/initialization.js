/**
 * Controller for Initialization TEMS Message.
 * NOT YET INPLEMENTED
 * @method initializationController
 * @memberof Controllers
 * @param  {Request} req
 * @param  {Response} res
 */

const initializationController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)
}

export default initializationController
