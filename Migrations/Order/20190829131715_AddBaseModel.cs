using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Order
{
    public partial class AddBaseModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    District = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    OrderId = table.Column<string>(nullable: true),
                    Width = table.Column<float>(nullable: false),
                    Height = table.Column<float>(nullable: false),
                    Representative = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
