using System;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.dbcontext
{
    public class TextTemplateContext : DbContext
    {
        public TextTemplateContext(DbContextOptions<TextTemplateContext> options)
            : base(options)
        { }

        public DbSet<TemplateModel> Templates { get; set; }
    }
}
