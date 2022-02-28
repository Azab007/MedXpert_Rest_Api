const errorHandlerMiddleware = (err, req, res, next) => {

    res.status(err.status||500)
    res.json({"err":err,"msg": err.message})
}



module.exports = errorHandlerMiddleware