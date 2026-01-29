namespace WorldCities.Api.DTO
{
    public class CityDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Lat { get; set; }
        public decimal Lon { get; set; }
    }
}
