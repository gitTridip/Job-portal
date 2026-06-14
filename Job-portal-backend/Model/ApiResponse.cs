namespace Job_portal_backend.Model
{
    public class ApiResponse<T>
    {
        public string Message { get; set; }
        public T Data { get; set; }

        public ApiResponse() { }

        public ApiResponse(string message, T data)
        {
            Message = message;
            Data = data;
        }
    }
}
