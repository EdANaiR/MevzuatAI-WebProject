using MevzuatAI.Application.DTOs;

namespace MevzuatAI.Application.Services // Veya Common.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    }
}