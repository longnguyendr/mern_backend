import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'

const create = (req, res, next) => {
    const user = new User(req.body)
    user.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.status(200).json({
            message: "Successfully signed up"
        })
    })
}
const list = (req, res) => {}
const userByID = (req, res, next, id) => {} 
const read = (req, res) => {}
const update = (req, rest, next) => {}
const remove = (req, rest, next) => {}

export default { create, list, userByID, read, update, remove }