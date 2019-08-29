using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Design
{
    public partial class AddBaseModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalStyle",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Canvas",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Canvas2",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePathTree",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "FontList",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Height",
                table: "Designs",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string[]>(
                name: "Keywords",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Pages",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrintType",
                table: "Designs",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Representative2",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubType",
                table: "Designs",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Width",
                table: "Designs",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalStyle",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Canvas",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Canvas2",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "FilePathTree",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "FontList",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Keywords",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Pages",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "PrintType",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Representative2",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "SubType",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Designs");
        }
    }
}
