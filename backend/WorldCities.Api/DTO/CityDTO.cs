using System.ComponentModel.DataAnnotations;

namespace WorldCities.Api.DTO
{
    public class CityDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = null!;

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
        public decimal Lat { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
        public decimal Lon { get; set; }
    }
}
