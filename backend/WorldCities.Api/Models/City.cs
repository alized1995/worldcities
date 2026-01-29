namespace WorldCities.Api.Models
{
    public class City
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Lat { get; set; }
        public decimal Lon { get; set; }
    }
}
