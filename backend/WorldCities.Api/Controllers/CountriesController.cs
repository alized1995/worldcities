using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
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
        public async Task<ActionResult<ApiResult<CountryDTO>>> GetCountries(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterQuery = null)
        {
            var countries = _context.Countries.Include(x => x.Cities).Select(c => new CountryDTO
            {
                Id = c.Id,
                Name = c.Name,
                ISO2 = c.ISO2,
                ISO3 = c.ISO3,
                TotCities = c.Cities!.Count
            });

            if (!string.IsNullOrEmpty(filterQuery))
            {
                countries = countries.Where(c => c.Name.ToLower().Contains(filterQuery.ToLower()));
            }

            return await ApiResult<CountryDTO>.CreateAsync(
                countries,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder);
        }

        [HttpPost("Import")]
        public async Task<IActionResult> Import(IFormFile file)
        {
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0]; 
                    var rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        var name = worksheet.Cells[row, 1]?.Value?.ToString() ?? "";
                        var iso2 = worksheet.Cells[row, 2]?.Value?.ToString() ?? "";
                        var iso3 = worksheet.Cells[row, 3]?.Value?.ToString() ?? "";

                        
                        if (!_context.Countries.Any(c => c.Name == name))
                        {
                            _context.Countries.Add(new Country
                            {
                                Name = name,
                                ISO2 = iso2,
                                ISO3 = iso3
                            });
                        }
                    }
                    await _context.SaveChangesAsync();
                }
            }
            return Ok();
        }
    }
}
