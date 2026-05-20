using Microsoft.AspNetCore.Mvc;
using MevzuatAI.Application.DTOs;
using MevzuatAI.Application.Services;

namespace MevzuatAI.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Dependency Injection ile Servisi içeri alıyoruz
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(result); // 200 Başarılı
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message }); // 400 Hata
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(result); // 200 Başarılı (Token döner)
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message }); // 401 Yetkisiz
            }
        }
    }
}