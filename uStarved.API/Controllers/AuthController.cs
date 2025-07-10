using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uStarved.API.Data;
using uStarved.API.Models;

namespace uStarved.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Geçersiz istek." });

            // Email kontrolü
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest(new { message = "Bu email adresi zaten kullanılıyor." });

            var user = new User
            {
                Email = model.Email,
                PasswordHash = model.Password, // Şifreyi direkt saklıyoruz
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kaydınız başarıyla oluşturulmuştur." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Geçersiz istek." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.PasswordHash == model.Password);
            if (user == null)
                return Unauthorized(new { message = "Email veya şifre hatalı." });

            return Ok(new
            {
                message = "Giriş başarılı!",
                userId = user.Id,
                email = user.Email
            });
        }
    }

    public class RegisterModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}