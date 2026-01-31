// Socket.IO instance will be set here
let ioInstance = null;

export const setIO = (io) => {
    ioInstance = io;
}

export const getIO = () => {
    return ioInstance;
}
