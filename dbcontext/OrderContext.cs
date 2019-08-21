using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class OrderContext : DbContext
    {
        public OrderContext(DbContextOptions<OrderContext> options)
            : base(options)
        {
        }

        public DbSet<OrderModel> Orders { get; set; }
    }
}
