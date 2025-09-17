import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  console.log(payload);
  const createUser = await prisma.user.create({
    data: payload,
  });
  return createUser;
};

// 49-7 get all user data
const getAllFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true,
      phone: true,
      picture: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      Post: true
    },
    orderBy:{
      createdAt: "desc" //this will display the latest user at the top
    }
  });
  return result;
};

// get user by ID
const getUserById = async (id:number) => {
  const result = await prisma.user.findUnique({
     select: {
      id:true,
      name: true,
      email: true,
      role: true,
      phone: true,
      picture: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      Post:true
    },
    where:{
      id
    }
  });
  return result;
};

// user delete
const userDelete = async(id: number) =>{
  const result = await prisma.user.delete({
    where:{
      id
    }
  })
  return result
}

// update user
const updateUser = async(id: number, payload: Partial<User>) =>{
  const result = await prisma.user.update({
    where:{
      id
    },
    data: payload
  })
  return result
}

export const UserService = {
  createUser,
  getAllFromDB,
  getUserById,
  userDelete,
  updateUser
};
