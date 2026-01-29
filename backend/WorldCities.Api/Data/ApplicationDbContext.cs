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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<City>().HasData(
                new City { Id = 1, Name = "Karachi", Lat = 24.8607M, Lon = 67.0011M },
                new City { Id = 2, Name = "Lahore", Lat = 31.5204M, Lon = 74.3587M }
            );
        }
    }
}
