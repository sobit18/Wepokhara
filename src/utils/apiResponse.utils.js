class ApiResponse {
    constructor(statusCode, message = "success", data) {
        this.success = statusCode < 400;
        this.data = { message };

        if (data && Array.isArray(data)) {
            this.data = {
                message,
                data: [...data],
            };
        } else if (data) {
            this.data = {
                message,
                data: { ...data },
            };
        }
    }
}

export default ApiResponse ;



