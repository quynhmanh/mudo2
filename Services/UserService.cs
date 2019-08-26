using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RCB.TypeScript;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class UserService : ServiceBase
    {
        // store in a db with hashed passwords in production applications

        private UserContext _userContext;

        private readonly TokenManagement _tokenManagement;

        public UserService(UserContext userContext)
        {
            _userContext = userContext;
        }

        public UserService(UserContext userContext, IOptions<TokenManagement> tokenManagement)
        {
            _userContext = userContext;
            _tokenManagement = tokenManagement.Value;
        }

        public User Login(HttpContext context, string username, string password)
        {
            context.Response.Cookies.Append(Constants.AuthorizationCookieKey, username);

            //var user = _users.SingleOrDefault(x => x.Username == username && x.Password == password);
            var user = new User { Username = username };

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            user.Token = GenerateJWTToken(username);

            return user;
        }

        public string GenerateJWTToken(string username) {
            var claim = new[]
            {
                new Claim(ClaimTypes.Name, username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenManagement.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jwtToken = new JwtSecurityToken(
                _tokenManagement.Issuer,
                _tokenManagement.Audience,
                claim,
                expires:DateTime.Now.AddMinutes(_tokenManagement.AccessExpiration),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        public Result Logout(HttpContext context) {
            context.Response.Cookies.Delete(Constants.AuthorizationCookieKey);
            return Ok();
        }

        public Result<User> Verify(HttpContext context) {
            var cookieValue = context.Request.Cookies[Constants.AuthorizationCookieKey];
            if (string.IsNullOrEmpty(cookieValue))
                return Error<User>();
            return Ok(new User
            {
                Username = cookieValue,
                Token = GenerateJWTToken(cookieValue)
            });
        }

        public void Add(User user)
        {
            _userContext.Users.Add(user);
            _userContext.SaveChanges();
        }
    }
}