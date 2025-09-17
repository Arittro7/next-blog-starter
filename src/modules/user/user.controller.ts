import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async(req: Request, res:Response) => {
  try {
    const result = await UserService.createUser(req.body)
    res.send(result)
  } catch (error) {
    console.log(error);
  }
}

// get all user data
const getAllFromDB = async(req: Request, res:Response) => {
  try {
    const result = await UserService.getAllFromDB()
    res.send(result)
  } catch (error) {
    console.log(error);
  }
}

// get user by id
const getUserById = async(req: Request, res: Response) =>{
  try {
    const result = await UserService.getUserById(Number(req.params.id))
    res.status(201).json(result)
  } catch (error) {
    res.status(500).send(error)
  }
}

// user delete
const userDelete = async(req: Request, res:Response) =>{
  try {
    const result = await UserService.userDelete(Number(req.params.id))
    res.status(201).json(result)
  } catch (error) {
    res.status(500).send(error)
  }
}

// update user
const updateUser = async(req: Request, res: Response) =>{
  try {
    const result = await UserService.updateUser(Number(req.params.id), req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const UserController = {
  createUser,
  getAllFromDB,
  getUserById,
  userDelete,
  updateUser
}