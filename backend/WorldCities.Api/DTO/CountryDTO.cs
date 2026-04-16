namespace WorldCities.Api.DTO
{
    public class CountryDTO
    {
            public int Id { get; set; }
            public string Name { get; set; } = null!;
            public string ISO1 { get; set; } = null!;
            public string ISO2 { get; set; } = null!;
            public int? TotCities { get; set; } // Extra field for analytics
        }
}
