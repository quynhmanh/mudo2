using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController : Controller
    {
        private readonly ITokenService _tokenService;
        private readonly UserContext _usersDb;
        public TokenController(ITokenService tokenService, UserContext usersDb)
        {
            _tokenService = tokenService;
            _usersDb = usersDb;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(req.Token);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = _usersDb.Users.SingleOrDefault(u => u.Username == username);
            if (user == null || user.RefreshToken != req.RefreshToken) return BadRequest();

            var newJwtToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.Token = newJwtToken;
            user.RefreshToken = newRefreshToken;
            await _usersDb.SaveChangesAsync();

            return Ok(new { value = new { token = newJwtToken, refreshToken = newRefreshToken} });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Revoke()
        {
            var username = User.Identity.Name;

            var user = _usersDb.Users.SingleOrDefault(u => u.Username == username);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            await _usersDb.SaveChangesAsync();

            return NoContent();
        }

    }
}