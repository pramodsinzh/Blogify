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
        const fileBuffer = fs.readFileSync(imageFile.path)

        //Upload Image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        //optimization throw imageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            tansformation: [
                { quality: 'auto' }, //Auto compression
                { format: 'webp' },  //Convert to modern format
                { width: '1280' }    //Weidth resizing
            ]
        })

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