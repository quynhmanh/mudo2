using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Design
{
    public partial class Representative : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Representative",
                table: "Designs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Representative",
                table: "Designs");
        }
    }
}
