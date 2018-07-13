const homeController = (req, res) => {
  res.status(200).send({
    message: 'Hello there, General Kenobi!',
  })
}

export default homeController
