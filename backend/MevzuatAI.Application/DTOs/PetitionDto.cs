namespace MevzuatAI.Application.DTOs
{
    // Dilekçe oluşturma isteği
    public class CreatePetitionDto
    {
        public string UserPrompt { get; set; } = string.Empty;
        public string GeneratedPdfPath { get; set; } = string.Empty;
        public Guid? TemplateId { get; set; }
    }

    // Dilekçe güncelleme (status vb.)
    public class UpdatePetitionDto
    {
        public int Status { get; set; } // 0=Draft, 1=Completed
        public string? GeneratedPdfPath { get; set; }
    }

    // Dilekçe listesi ve detay yanıtı
    public class PetitionResponseDto
    {
        public Guid Id { get; set; }
        public string UserPrompt { get; set; } = string.Empty;
        public string GeneratedPdfPath { get; set; } = string.Empty;
        public int Status { get; set; }
        public string StatusLabel => Status == 1 ? "Tamamlandı" : "Taslak";
        public Guid UserId { get; set; }
        public Guid? TemplateId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}