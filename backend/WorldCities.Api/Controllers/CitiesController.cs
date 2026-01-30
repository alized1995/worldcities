using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldCities.Api.Data;
using WorldCities.Api.DTO;
using WorldCities.Api.Models;

namespace WorldCities.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<CityDTO>>> GetCities(int pageIndex = 0, int pageSize = 10, string? sortColumn = null, string? sortOrder = null, string? filterQuery = null)
        {

            var cities = _context.Cities.Select(c => new CityDTO
            {
                Id = c.Id,
                Name = c.Name,
                Lat = c.Lat,
                Lon = c.Lon
            });

            if (!string.IsNullOrEmpty(filterQuery))
            {
                cities = cities.Where(c => c.Name.ToLower().Contains(filterQuery.ToLower()));
            }

            return await ApiResult<CityDTO>.CreateAsync(cities,
            pageIndex,
            pageSize,
            sortColumn,
            sortOrder
            );
        }
    }
}
