function MyErrorHandler(err, req, res, next) {
    return res.status(500).json(err)
}

module.exports = MyErrorHandler