using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class DesignContext : DbContext
    {
        public DesignContext(DbContextOptions<DesignContext> options)
            : base(options)
        { }

        public DbSet<DesignModel> Designs { get; set; }
    }
}
