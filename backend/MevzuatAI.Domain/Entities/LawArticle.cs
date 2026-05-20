using MevzuatAI.Domain.Common;

namespace MevzuatAI.Domain.Entities
{
    public class LawArticle : BaseEntity
    {
        /// <summary>
        /// Örn: "6502 Tüketici Kanunu"
        /// </summary>
        public string LawName { get; set; } = null!;

        /// <summary>
        /// Örn: "Madde 11"
        /// </summary>
        public string ArticleNumber { get; set; } = null!;

        /// <summary>
        /// Maddenin tam metni.
        /// </summary>
        public string Content { get; set; } = null!;

        /// <summary>
        /// RAG için kullanılacak pgvector embedding verisi.
        /// </summary>
        public float[] VectorData { get; set; } = Array.Empty<float>();

    }
}
