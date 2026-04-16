namespace WorldCities.Api.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string ISO2 { get; set; } = null!;
        public string ISO3 { get; set; } = null!;
        public virtual ICollection<City> Cities { get; set; }
    }
}
