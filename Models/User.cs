using System;
using System.ComponentModel.DataAnnotations;

namespace RCB.TypeScript.Models
{
    public class User : Base
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string[] Colors { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        [DataType(DataType.Date)]
        public DateTime RefreshExpiration { get; set; } = DateTime.UtcNow;
    }
}
