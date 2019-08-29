using System;
using System.ComponentModel.DataAnnotations;

namespace RCB.TypeScript.Models
{
    public class UserInfoResponse
    {
        public string Username { get; set; }
    
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public UserInfoResponse(string username, string token, string refreshToken) {
            Username = username;
            Token = token;
            RefreshToken = refreshToken;
        }
    }
}
