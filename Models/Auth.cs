using System;
namespace RCB.TypeScript.Models
{
    public class Auth
    {
        public string Token { get; set; }

        public string Provider { get; set; }

        public string Scope { get; set; }
    }
}