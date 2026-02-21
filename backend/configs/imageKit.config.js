import ImageKit from '@imagekit/nodejs';

var imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

export default imagekit;