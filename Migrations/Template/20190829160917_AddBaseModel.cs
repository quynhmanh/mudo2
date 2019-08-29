using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Template
{
    public partial class AddBaseModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Pages",
                table: "Templates",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrintType",
                table: "Templates",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pages",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "PrintType",
                table: "Templates");
        }
    }
}
