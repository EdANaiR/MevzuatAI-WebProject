using MevzuatAI.Domain.Common;

namespace MevzuatAI.Domain.Entities
{
    public class PetitionTemplate : BaseEntity
    {
        public string Title { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string TemplateContent { get; set; } = null!;

        /// <summary>
        /// JSON verisi olarak zorunlu alanları tutar.
        /// </summary>
        public string RequiredInputs { get; set; } = null!;

        /// <summary>
        /// pgvector embedding verisi için kullanılır.
        /// </summary>
        public float[]? VectorData { get; set; }
    }
}
