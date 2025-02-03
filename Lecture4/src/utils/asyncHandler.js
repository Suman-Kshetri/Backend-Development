//we connect to database many time in our code so we can create a function that will handle the error and connect to database
//ie : general code for connecting to database to avoid repeating the code.


const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            next(err);
        });
    }

}

export { asyncHandler};








// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async() => {}


//using try catch block to handle the error
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         req.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// };