using Microsoft.AspNetCore.Mvc;

namespace MevzuatAI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() =>
        Ok(new
        {
            status = "healthy",
            service = "MevzuatAI.WebAPI",
            timestamp = DateTime.UtcNow,
        });
}
