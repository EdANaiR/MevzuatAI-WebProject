using MevzuatAI.Application.DTOs;

namespace MevzuatAI.Application.Common.Interfaces
{
    public interface IAIService
    {
        Task<ChatResponseDto> GetAnswerAsync(ChatRequestDto request);
    }
}