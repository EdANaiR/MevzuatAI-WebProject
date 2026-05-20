namespace MevzuatAI.Application.DTOs
{
    public class AuthResponseDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty; // Frontend'de göstermek için
        public string Token { get; set; } = string.Empty;    // JWT Token
    }
}