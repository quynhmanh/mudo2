using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Font
{
    public partial class AddRep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Representative",
                table: "Fonts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Representative",
                table: "Fonts");
        }
    }
}
