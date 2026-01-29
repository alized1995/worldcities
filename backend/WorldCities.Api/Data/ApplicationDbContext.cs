using Microsoft.EntityFrameworkCore;
using WorldCities.Api.Models;

namespace WorldCities.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<City> Cities => Set<City>();
    }
}
