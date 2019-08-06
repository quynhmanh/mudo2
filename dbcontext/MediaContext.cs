using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class MediaContext : DbContext
    {
        public MediaContext(DbContextOptions<MediaContext> options)
            : base(options)
        {
        }

        public DbSet<MediaModel> Medias { get; set; }
    }
}
