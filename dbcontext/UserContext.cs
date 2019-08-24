using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
    }
}
