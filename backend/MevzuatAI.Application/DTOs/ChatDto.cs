namespace MevzuatAI.Application.DTOs
{
    // Frontend'den gelen mesaj
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public string History { get; set; } = string.Empty; // Eski konuşmaları da atacağız ki konuyu unutmasın
    }

    // Backend'den dönen cevap
    public class ChatResponseDto
    {
        public string Response { get; set; } = string.Empty;
    }
}