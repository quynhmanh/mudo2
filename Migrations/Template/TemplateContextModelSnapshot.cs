﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RCB.TypeScript.dbcontext;

namespace RCB.TypeScript.Migrations.Template
{
    [DbContext(typeof(TemplateContext))]
    partial class TemplateContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("RCB.TypeScript.Models.TemplateModel", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AdditionalStyle");

                    b.Property<string[]>("Canvas");

                    b.Property<string[]>("Canvas2");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int>("CreatedBy");

                    b.Property<string>("Document")
                        .HasColumnType("jsonb");

                    b.Property<string>("FilePath");

                    b.Property<string>("FilePathTree");

                    b.Property<string>("FirstName");

                    b.Property<string[]>("FontList");

                    b.Property<float>("Height");

                    b.Property<string[]>("Keywords");

                    b.Property<string[]>("Pages");

                    b.Property<int?>("PrintType");

                    b.Property<string>("Representative");

                    b.Property<string>("Representative2");

                    b.Property<string>("SubType");

                    b.Property<string>("Type");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UpdatedBy");

                    b.Property<float>("Width");

                    b.HasKey("Id");

                    b.ToTable("Templates");
                });
#pragma warning restore 612, 618
        }
    }
}
