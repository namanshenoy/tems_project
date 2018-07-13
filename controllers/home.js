
/**
 * Controls messages recieved at the / endpoint
 * @param {Request} req - Request from client
 * @param {Response} res - Request to client
 */
const homeController = (req, res) => {
  res.status(200).send({
    message: 'Hello there, General Kenobi!',
  })
}

export default homeController
