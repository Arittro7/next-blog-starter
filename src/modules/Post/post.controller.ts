import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
//  get all posts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    //` query getting zone
    const page = Number(req.query.page) || 1 
    const limit = Number(req.query.limit) || 10
    const search = (req.query.search as string) || ""
    const isFeatured  = req.query.isFeatured ? req.query.isFeatured === 'true' : undefined
    const tags = req.query.tags ? (req.query.tags as string).split(",") : []
    const sortBy = (req.query.sortBy as string) || "createdAt"
    const orderBy = (req.query.orderBy as string) || "desc"
    
    //` query passing area
    const result = await PostService.getAllPosts({page, limit, search, isFeatured, tags, sortBy, orderBy});
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get post by ID
const getPostById = async(req: Request, res:Response) =>{
   try {
    const result = await PostService.getPostById(Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

// update Post
const updatePost = async(req: Request, res: Response) =>{
  try {
    const result = await PostService.updateUser(Number(req.params.id), req.body)
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

// delete Post
const deletePost = async(req: Request, res: Response) =>{
  try {
    const result = await PostService.deletePost(Number(req.params.id))
    res.status(201).json(result)
  } catch (error) {
    res.status(500).send(error);
  }
}

const getBlogStat = async (req: Request, res: Response) => {
    try {
        const result = await PostService.getBlogStat();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats", details: err });
    }
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStat
};
