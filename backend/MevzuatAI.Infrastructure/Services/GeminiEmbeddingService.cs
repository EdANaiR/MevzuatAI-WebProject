using System.Text;
using System.Text.Json;
using MevzuatAI.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace MevzuatAI.Infrastructure.Services
{
    public class GeminiEmbeddingService : IEmbeddingService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        // Google'ın embedding endpoint'i (OpenRouter değil, direkt Google AI Studio öneririm embedding için daha stabil)
        private const string _baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent"; 

        public GeminiEmbeddingService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["Gemini:ApiKey"] ?? ""; // Google API Key'in buraya gelmeli
        }

        public async Task<float[]> GetEmbeddingAsync(string text)
        {
            var requestBody = new
            {
                model = "models/text-embedding-004",
                content = new
                {
                    parts = new[]
                    {
                        new { text = text }
                    }
                }
            };

            var url = $"{_baseUrl}?key={_apiKey}";
            
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody), 
                Encoding.UTF8, 
                "application/json");

            var response = await _httpClient.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Embedding API Hatası: {error}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<EmbeddingResponse>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // Eğer null gelirse boş array dön veya hata fırlat
            return result?.Embedding?.Values ?? Array.Empty<float>();
        }

        // Response Modelleri
        private class EmbeddingResponse
        {
            public EmbeddingData? Embedding { get; set; }
        }
        private class EmbeddingData
        {
            public float[]? Values { get; set; }
        }
    }
}