using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Template
{
    public partial class AddRep2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalStyle",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Canvas",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Canvas2",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePathTree",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Keywords",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Representative2",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubType",
                table: "Templates",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalStyle",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Canvas",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Canvas2",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "FilePathTree",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Keywords",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Representative2",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "SubType",
                table: "Templates");
        }
    }
}
