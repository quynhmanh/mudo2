using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Media
{
    public partial class AddBaseModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Medias",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Medias",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Medias",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Ext",
                table: "Medias",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Medias",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "Medias",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Medias",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "Ext",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Medias");
        }
    }
}
