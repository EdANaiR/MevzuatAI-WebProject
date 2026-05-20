using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MevzuatAI.Application.DTOs;
using MevzuatAI.Application.Services;
using System.Security.Claims;

namespace MevzuatAI.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PetitionsController : ControllerBase
    {
        private readonly IPetitionService _petitionService;

        public PetitionsController(IPetitionService petitionService)
        {
            _petitionService = petitionService;
        }

        private Guid GetUserId()
        {
            var claim = User.FindFirst("sub")
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !Guid.TryParse(claim.Value, out var userId))
                throw new UnauthorizedAccessException("Kullanıcı kimliği doğrulanamadı.");

            return userId;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyPetitions()
        {
            try
            {
                var userId = GetUserId();
                var petitions = await _petitionService.GetUserPetitionsAsync(userId);
                return Ok(petitions);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPetition(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var petition = await _petitionService.GetPetitionByIdAsync(id, userId);
                if (petition == null) return NotFound(new { message = "Dilekçe bulunamadı." });
                return Ok(petition);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePetition([FromBody] CreatePetitionDto request)
        {
            try
            {
                var userId = GetUserId();
                var petition = await _petitionService.CreatePetitionAsync(userId, request);
                return CreatedAtAction(nameof(GetPetition), new { id = petition.Id }, petition);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePetition(Guid id, [FromBody] UpdatePetitionDto request)
        {
            try
            {
                var userId = GetUserId();
                var petition = await _petitionService.UpdatePetitionAsync(id, userId, request);
                return Ok(petition);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetition(Guid id)
        {
            try
            {
                var userId = GetUserId();
                await _petitionService.DeletePetitionAsync(id, userId);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var result = await _petitionService.MarkAsCompletedAsync(id, userId);
                if (!result) return NotFound(new { message = "Dilekçe bulunamadı." });
                return Ok(new { message = "Dilekçe tamamlandı.", status = "Completed" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}