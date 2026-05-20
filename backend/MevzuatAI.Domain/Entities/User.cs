using System;
using System.Collections.Generic;
using MevzuatAI.Domain.Common;

namespace MevzuatAI.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public ICollection<Petition> Petitions { get; set; } = new List<Petition>();
    }
}
