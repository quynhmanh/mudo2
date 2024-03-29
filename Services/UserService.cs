﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
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

        private readonly ITokenService _tokenService;


        public UserService(UserContext userContext, ITokenService tokenService)
        {
            _userContext = userContext;
            _tokenService = tokenService;
        }

        public UserInfoResponse Login(HttpContext context, string username, string password, string name)
        {
            var user = _userContext.Users.SingleOrDefault(u => u.Username == username);

            DateTime current = DateTime.UtcNow;

            // create new user if user not found
            if (user == null)
            {
                user = new User { Username = username };
                var usersClaims = new [] 
                {
                    new Claim(ClaimTypes.Name, user.Username),                
                    // new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                };

                var jwtToken = _tokenService.GenerateAccessToken(usersClaims);
                var refreshToken = _tokenService.GenerateRefreshToken();

                user.Token = jwtToken;
                user.RefreshToken = refreshToken;
                user.CreatedAt = current;
                user.RefreshExpiration = current.AddMinutes(_tokenService.GetRefreshExpiration());
                _userContext.Users.Add(user);
            }

            user.UpdatedAt = current;
            if (user.RefreshExpiration == null || DateTime.Compare(user.RefreshExpiration, current) < 0)
                user.RefreshExpiration = current.AddMinutes(_tokenService.GetRefreshExpiration());
            
            if (user.CreatedAt == null)
                user.CreatedAt = current;

            _userContext.SaveChanges();

            context.Response.Cookies.Append(Constants.AuthorizationCookieKey, username);

            return GetUserInfoResponse(user);
        }

        public string[] GetColors(string username) {
            var user = _userContext.Users.SingleOrDefault(u => u.Username == username);
            return user.Colors != null ? user.Colors : new string[0];
        }

        public Result UpdateColors(string username, string[] colors) {
            var user = _userContext.Users.SingleOrDefault(u => u.Username == username);
            user.Colors = colors;
            _userContext.SaveChanges();
            return Ok();
        }

        private UserInfoResponse GetUserInfoResponse(User user) {
            return new UserInfoResponse(
                user.Username,
                user.Token,
                user.RefreshToken
            );
        }

        public Result Logout(HttpContext context) {
            context.Response.Cookies.Delete(Constants.AuthorizationCookieKey);
            return Ok();
        }

        public Result<UserInfoResponse> Verify(HttpContext context) {
            var cookieValue = context.Request.Cookies[Constants.AuthorizationCookieKey];
            if (string.IsNullOrEmpty(cookieValue))
                return Error<UserInfoResponse>();

            var user = _userContext.Users.SingleOrDefault(u => u.Username == cookieValue);
            if (user == null)
                return Error<UserInfoResponse>();

            return Ok(GetUserInfoResponse(user));
        }

        public void Add(User user)
        {
            _userContext.Users.Add(user);
            _userContext.SaveChanges();
        }
    }
}