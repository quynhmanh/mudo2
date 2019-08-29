﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using NpgsqlTypes;
using RCB.TypeScript.dbcontext;

namespace RCB.TypeScript.Migrations.Media
{
    [DbContext(typeof(MediaContext))]
    [Migration("20190829131657_AddBaseModel")]
    partial class AddBaseModel
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("RCB.TypeScript.Models.MediaModel", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int>("CreatedBy");

                    b.Property<string>("Ext");

                    b.Property<string>("FirstName");

                    b.Property<string[]>("Keywords");

                    b.Property<string>("LastName");

                    b.Property<string>("Representative");

                    b.Property<int>("Type");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UpdatedBy");

                    b.Property<string>("UserEmail");

                    b.Property<float>("Width");

                    b.Property<float>("height");

                    b.Property<NpgsqlTsVector>("query");

                    b.HasKey("Id");

                    b.ToTable("Medias");
                });
#pragma warning restore 612, 618
        }
    }
}
