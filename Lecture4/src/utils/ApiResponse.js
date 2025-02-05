class ApiResponse {
    constructor(statusCodes, message= 'Success', data){
        this.statusCodes = statusCodes;
        this.message = message;
        this.data = data;
        this.suceess = statusCodes < 400;
    }
}

export {ApiResponse}