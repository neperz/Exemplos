using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;


namespace NeperZ.Infra.Services
{
    public class UserService : IUserService
    {
        readonly private IMemoryCache _memoryCache;
        readonly private HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        static SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);
        
public UserService(IHttpContextAccessor httpContextAccessor, IMemoryCache memoryCache, HttpClient httpClient, IConfiguration configuration)
        {
            _memoryCache = memoryCache;
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;

        }

        public async Task<IEnumerable<UserModel>> GetAllAsync()
        {
            var users = _memoryCache.Get<IEnumerable<UserModel>>("_Users");

            if (users == null)
            {
                await _semaphoreSlim.WaitAsync();
                var response = await _httpClient.GetAsync($"/api/v2/user/");
                var stringResponse = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    users = JsonConvert.DeserializeObject<IEnumerable<UserModel>>(stringResponse);
                    var cacheOptions = new MemoryCacheEntryOptions()
                            .SetSlidingExpiration(TimeSpan.FromHours(12));
                    _memoryCache.Set("_Users", users, cacheOptions);
                }
                _semaphoreSlim.Release();

            }
            return users;
        }

        public async Task RecargaAllAsync()
        {
            var response = await _httpClient.GetAsync($"/api/v2/User/");
            var stringResponse = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                var users = JsonConvert.DeserializeObject<IEnumerable<UserModel>>(stringResponse);
                var cacheOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromHours(12));
                _memoryCache.Set("_Users", users, cacheOptions);
            }
        }
  }
}
