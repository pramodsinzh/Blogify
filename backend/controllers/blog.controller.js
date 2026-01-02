import fs from 'fs'
import imagekit from '../configs/imageKit.config.js';
import Blog from '../models/blog.model.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Check if all fields are present
        if (!title || !description || !category || !imageFile) {
            return res.json({
                success: false,
                message: "Missing required fields"
            })
        }
        // Create a read stream from the file
        const fileStream = fs.createReadStream(imageFile.path)

        //Upload Image to ImageKit
        const response = await imagekit.files.upload({
            file: fileStream,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // Construct optimized URL with transformations
        // ImageKit transformations are applied via URL parameters
        const optimizedImageUrl = response.url ? `${response.url}?tr=w-1280,q-auto,f-webp` : response.url;

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })
        res.json({
            success: true,
            message: "Blog added successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}