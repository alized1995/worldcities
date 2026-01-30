using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace WorldCities.Api.Data
{
    public class ApiResult<T>
    {
        // Properties
        public List<T> Data { get; private set; }
        public int PageIndex { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }
        public int TotalPages { get; private set; }

        private ApiResult(List<T> data, int count, int pageIndex, int pageSize, string? sortColumn = null, string? sortOrder = null)
        {
            Data = data;
            TotalCount = count;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        }

        // method performing the pagination
        public static async Task<ApiResult<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize, string? sortColumn = null, string? sortOrder = null)
        {
            var count = await source.CountAsync();

            if (!string.IsNullOrEmpty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder) && sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC";

                source = source.OrderBy($"{sortColumn} {sortOrder}");
            }
            // paging
            var items = await source
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ApiResult<T>(items, count, pageIndex, pageSize, sortColumn, sortOrder);
        } 
    }
}
