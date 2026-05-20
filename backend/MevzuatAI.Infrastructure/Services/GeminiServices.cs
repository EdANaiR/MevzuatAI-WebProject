using System.Text;
using System.Text.Json;
using System.Net.Http.Headers; // Bu kütüphane gerekli!
using MevzuatAI.Application.Common.Interfaces;
using MevzuatAI.Application.DTOs;
using Microsoft.Extensions.Configuration;

namespace MevzuatAI.Infrastructure.Services
{
    public class GeminiService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly string _model;

        public GeminiService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            // Null kontrolü (? :)
            _apiKey = configuration["Gemini:ApiKey"] ?? "";
            _baseUrl = configuration["Gemini:BaseUrl"] ?? "";
            _model = configuration["Gemini:Model"] ?? "google/gemini-2.0-flash-lite-preview-02-05:free";
        }

        public async Task<ChatResponseDto> GetAnswerAsync(ChatRequestDto request)
        {

            string systemPrompt = "Sen yardımsever ve uzman bir hukuk asistanısın. Cevapların kısa, net ve çözüm odaklı olsun.\n\nSoru: ";
            // 1. OpenRouter (OpenAI Standardı) İstek Formatı
           var requestBody = new
    {
        model = _model,
        messages = new[]
        {
            // 'system' rolü yerine her şeyi 'user' içine koyuyoruz
            new { role = "user", content = systemPrompt + request.Message }
        }
    };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody), 
                Encoding.UTF8, 
                "application/json");

            // 2. Header Ayarları (Yetkilendirme)
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            
            // OpenRouter, bu headerları göndermemizi öneriyor (İstatistik için)
            if (!_httpClient.DefaultRequestHeaders.Contains("HTTP-Referer"))
            {
                _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "http://localhost:3000"); // Senin site adresin
                _httpClient.DefaultRequestHeaders.Add("X-Title", "MevzuatAI"); // Proje adı
            }

            // 3. İsteği Gönder
            // Burada BaseUrl, OpenRouter adresi olmalı
            var response = await _httpClient.PostAsync(_baseUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenRouter Hatası: {response.StatusCode} - {errorContent}");
            }

            // 4. Cevabı Oku ve Parse Et
            var responseString = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            
            try 
            {
                var result = JsonSerializer.Deserialize<OpenRouterResponse>(responseString, options);
                var answer = result?.Choices?.FirstOrDefault()?.Message?.Content;

                return new ChatResponseDto
                {
                    Response = answer ?? "Cevap alınamadı."
                };
            }
            catch
            {
                return new ChatResponseDto { Response = "Cevap formatı işlenemedi: " + responseString };
            }
        }

        // OpenRouter Cevap Modelleri (Google'dan farklıdır!)
        private class OpenRouterResponse
        {
            public Choice[]? Choices { get; set; }
        }
        private class Choice
        {
            public Message? Message { get; set; }
        }
        private class Message
        {
            public string? Content { get; set; }
            public string? Role { get; set; }
        }
    }
}