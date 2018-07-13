const statusController = (req, res) => {
  console.log(req.originalUrl)
  res.sendStatus(200)
  console.log('Tester: ', req.params.testerName)
}

export default statusController
