import express, { NextFunction } from 'express'
import { passwordHash, passwordCompare } from '../utils/bcrypt'
import userModel from '../models/user.model'
import CustomResponse from '../utils/response.handler'
import { jwtSign } from '../utils/auth.util'

export async function SignUp(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {
    const { fullName, email, password } = request.body
    const hashedPassword = await passwordHash(password)

    const userExists = await userModel.findOne({ email: email }).exec()
    if (userExists) {
        return next(new CustomResponse(response).error(
            'You cannot use this mail again',
            400
        ))
    }

    const newUSer = new userModel({
        fullName: fullName,
        email: email,
        password: hashedPassword
    })
    await newUSer.save()
    return next(new CustomResponse(response).success(
        'Welcome onboard!',
        newUSer,
        201,
        {
            type: 'success',
            action: 'sign-up'
        }
    ))
}

export async function LogIn(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {
    const { email, password } = request.body
    const user = await userModel.findOne({ email }).exec()
    if (!user) {
        return next(new CustomResponse(response).error('Email does not exist', 404))
    }
    const verifyPassword = await passwordCompare(password, user.password)
    if (!verifyPassword) {
        return next(new CustomResponse(response).error('Password is incorrect', 401))
    }

    const payload = {
        _id: user._id,
        fullname: user.fullName,
        email: user.email
    }
    const token = await jwtSign(payload)
    return next(new CustomResponse(response).success(
        'Welcome Back!',
        { user, token },
        200,
        {
            type: 'success',
            action: 'login'
        }
    ))
}

export async function updateDetails(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {
    const userId = request.user._id
    const user = await userModel.findOne({ _id: userId }).exec()
    if (!user) {
        return next(new CustomResponse(response).error(
            'User not found',
            404
        ))
    }
    await userModel.findOneAndUpdate({ _id: userId }, request.body, { $new: true }).exec() as any


    return next(new CustomResponse(response).success(
        'Record updated',
        {},
        200,
        {
            type: 'success',
            action: 'update'
        }
    ))
}

export async function changePassword(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {
    const userId = request.user._id
    const user = await userModel.findOne({ _id: userId }).exec()
    if (!user) {
        return next(new CustomResponse(response).error(
            'User not found',
            404
        ))
    }
    const { password } = request.body
    if (!password) {
        return next(new CustomResponse(response).error(
            'Field is required',
            403
        ))
    }
    const hashedPassword = await passwordHash(password)
    user.password = hashedPassword
    await user.save()
    return next(new CustomResponse(response).success(
        'Password changed successfully',
        {},
        200,
        {
            type: 'success',
            action: 'password-change'
        }
    ))
}