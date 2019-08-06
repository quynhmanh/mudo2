using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

namespace RCB.TypeScript.Migrations.Media
{
    public partial class Query : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "query",
                table: "Medias",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "query",
                table: "Medias");
        }
    }
}
