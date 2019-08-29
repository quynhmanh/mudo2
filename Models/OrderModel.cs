using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RCB.TypeScript.Models
{
    public class OrderModel : Base
    {
        [Key]
        public string Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string PhoneNumber { get; set; }
        public string OrderId { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
        public string Representative { get; set; }

        public OrderModel()
        {
        }
    }
}
