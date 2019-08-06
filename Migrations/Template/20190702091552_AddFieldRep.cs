using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Template
{
    public partial class AddFieldRep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Representative",
                table: "Templates",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Representative",
                table: "Templates");
        }
    }
}
