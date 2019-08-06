﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RCB.TypeScript.dbcontext;

namespace RCB.TypeScript.Migrations.Design
{
    [DbContext(typeof(DesignContext))]
    [Migration("20190702180537_Representative")]
    partial class Representative
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("RCB.TypeScript.Models.DesignModel", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int>("CreatedBy");

                    b.Property<string>("Document")
                        .HasColumnType("jsonb");

                    b.Property<string>("Representative");

                    b.Property<string>("Type");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UpdatedBy");

                    b.HasKey("Id");

                    b.ToTable("Designs");
                });
#pragma warning restore 612, 618
        }
    }
}
