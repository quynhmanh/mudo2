using Microsoft.EntityFrameworkCore.Migrations;

namespace RCB.TypeScript.Migrations.Media
{
    public partial class WidthHeightToModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Width",
                table: "Medias",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "height",
                table: "Medias",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Width",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "height",
                table: "Medias");
        }
    }
}
