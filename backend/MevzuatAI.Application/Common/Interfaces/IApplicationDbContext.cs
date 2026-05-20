using MevzuatAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MevzuatAI.Application
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Petition> Petitions { get; }
        DbSet<LawArticle> LawArticles { get; }
        DbSet<PetitionTemplate> PetitionTemplates { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}