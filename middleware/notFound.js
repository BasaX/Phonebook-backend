module.exports = (request, response, next) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
}
