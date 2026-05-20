using System;
using MevzuatAI.Domain.Common;
using MevzuatAI.Domain.Enums;

namespace MevzuatAI.Domain.Entities
{
    public class Petition : BaseEntity
    {
        public Guid UserId { get; set; }
        

public Guid? TemplateId { get; set; } // Hangi şablon kullanıldı? (Opsiyonel olabilir)
public PetitionTemplate? Template { get; set; }
        public User User { get; set; } = null!;

        /// <summary>
        /// Kullanıcının yazdığı doğal dil şikayeti.
        /// </summary>
        public string UserPrompt { get; set; } = null!;

        public string GeneratedPdfPath { get; set; } = null!;

        public PetitionStatus Status { get; set; }
    }
}
