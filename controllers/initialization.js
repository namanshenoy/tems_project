/**
 * Controller for Initialization TEMS Message.
 * NOT YET INPLEMENTED
 * @method initializationController
 * @memberof Controllers
 * @param  {Request} req - Incoming Request
 * @param  {Response} res - Outgoing Response
 */

const initializationController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)
}

export default initializationController
