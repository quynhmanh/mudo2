using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class FontContext : DbContext
    {
        public FontContext(DbContextOptions<FontContext> options)
            : base(options)
        {
        }

        public DbSet<FontModel> Fonts { get; set; }
    }
}
