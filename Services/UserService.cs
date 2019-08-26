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

        private readonly TokenService _tokenService;


        public UserService(UserContext userContext, TokenService tokenService)
        {
            _userContext = userContext;
            _tokenService = tokenService;
        }

        public User Login(HttpContext context, string username, string password)
        {
            var user = _userContext.Users.SingleOrDefault(u => u.Username == username);

            // return null if user not found
            if (user == null)
                // return null;
                user = new User { Username = username };

            context.Response.Cookies.Append(Constants.AuthorizationCookieKey, username);

            var usersClaims = new [] 
            {
                new Claim(ClaimTypes.Name, user.Username),                
                // new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var jwtToken = _tokenService.GenerateAccessToken(usersClaims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.Token = jwtToken;
            user.RefreshToken = refreshToken;
            _userContext.SaveChanges();

            return user;
        }

        public Result Logout(HttpContext context) {
            context.Response.Cookies.Delete(Constants.AuthorizationCookieKey);
            return Ok();
        }

        public Result<User> Verify(HttpContext context) {
            var cookieValue = context.Request.Cookies[Constants.AuthorizationCookieKey];
            if (string.IsNullOrEmpty(cookieValue))
                return Error<User>();

            var user = _userContext.Users.SingleOrDefault(u => u.Username == cookieValue);
            if (user == null)
                user = new User 
                { 
                    Username = cookieValue, 
                    Token = _tokenService.GenerateAccessToken(new [] 
                    {
                        new Claim(ClaimTypes.Name, cookieValue),                
                    }), 
                    RefreshToken = _tokenService.GenerateRefreshToken() 
                };

            return Ok(user);
        }

        public void Add(User user)
        {
            _userContext.Users.Add(user);
            _userContext.SaveChanges();
        }
    }
}