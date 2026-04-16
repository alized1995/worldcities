using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldCities.Api.Migrations
{
    /// <inheritdoc />
    public partial class country_table_COLUMN_change : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ISO1",
                table: "Countries",
                newName: "ISO3");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ISO3",
                table: "Countries",
                newName: "ISO1");
        }
    }
}
