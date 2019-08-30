using System;
using System.ComponentModel.DataAnnotations;

namespace RCB.TypeScript.Models
{
    public class Base
    {
        [DataType(DataType.Date)]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public int CreatedBy { get; set; }

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        public int UpdatedBy { get; set; }
    }
}
