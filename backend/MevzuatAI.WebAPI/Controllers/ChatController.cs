using MevzuatAI.Application.Common.Interfaces;
using MevzuatAI.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MevzuatAI.WebAPI.Controllers
{
    // Sadece giriş yapmış kullanıcılar sohbet edebilir!
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IAIService _aiService;

        public ChatController(IAIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequestDto request)
        {
            // Kullanıcının boş mesaj atmasını engelle
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Mesaj boş olamaz.");
            }

            try
            {
                // Yapay zekaya sor
                var response = await _aiService.GetAnswerAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                // Hata olursa (örneğin Google sunucusu çökerse)
                return StatusCode(500, new { message = "Yapay zeka şu an cevap veremiyor.", error = ex.Message });
            }
        }
    }
}