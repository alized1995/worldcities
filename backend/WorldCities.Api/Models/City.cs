using System.ComponentModel.DataAnnotations.Schema;

namespace WorldCities.Api.Models
{
    public class City
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Lat { get; set; }
        public decimal Lon { get; set; }
        public int? CountryId { get; set; }
        public virtual Country? Country { get; set; }
    }
}
