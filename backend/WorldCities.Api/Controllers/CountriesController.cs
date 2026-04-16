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
    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ActionResult<ApiResult<Country>>> GetCountries(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterQuery = null)
        {
            var countries = _context.Countries.Select(c => new CountryDTO
            {
                Id = c.Id,
                Name = c.Name,
                ISO1 = c.ISO1,
                ISO2 = c.ISO2
            });

            if (!string.IsNullOrEmpty(filterQuery))
            {
                countries = countries.Where(c => c.Name.ToLower().Contains(filterQuery.ToLower()));
            }

            return await ApiResult<Country>.CreateAsync(
                _context.Countries.AsNoTracking(),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder);
        }
    }
}
