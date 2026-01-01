import ImageKit from 'imagekit';

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey :process.env.IMAGEKIT_PRIVATE_KEY,
    urlEnfpoint :process.env.IMAGEKIT_URL_ENDPOINT
})

export default imagekit;