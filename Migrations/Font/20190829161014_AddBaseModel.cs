using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Font
{
    public partial class AddBaseModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Fonts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Fonts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Fonts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "Fonts",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Fonts");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Fonts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Fonts");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Fonts");
        }
    }
}
