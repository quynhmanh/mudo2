using System.Collections.Generic;
using System.Security.Claims;

namespace RCB.TypeScript.Services
{
    public interface ITokenService
    {
         string GenerateAccessToken(IEnumerable<Claim> claims);         
         string GenerateRefreshToken();    
         ClaimsPrincipal GetPrincipalFromExpiredToken(string token);            
    }
}