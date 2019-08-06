﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RCB.TypeScript.dbcontext;

namespace RCB.TypeScript.Migrations.Media
{
    [DbContext(typeof(MediaContext))]
    [Migration("20190805072115_Keywords")]
    partial class Keywords
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("RCB.TypeScript.Models.MediaModel", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FirstName");

                    b.Property<string[]>("Keywords");

                    b.Property<string>("LastName");

                    b.Property<string>("Representative");

                    b.Property<int>("Type");

                    b.Property<float>("Width");

                    b.Property<float>("height");

                    b.HasKey("Id");

                    b.ToTable("Medias");
                });
#pragma warning restore 612, 618
        }
    }
}
