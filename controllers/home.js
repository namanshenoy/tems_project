/**
 * Controller for Home URL.
 * URL path for /
 * @method homeController
 * Refer to this by {@link Controllers.".homeController"}
 * @memberof Controllers
 * @param  {Request} req - Incoming Request
 * @param  {Response} res - Outgoing Response
 */

const homeController = (req, res) => {
  res.status(200).send({
    message: 'Hello there, General Kenobi!',
  })
}

export default homeController
