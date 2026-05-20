using MevzuatAI.Domain.Entities;

namespace MevzuatAI.Application.Repositories
{
    public interface IPetitionRepository : IGenericRepository<Petition>
    {
        Task<IEnumerable<Petition>> GetByUserIdAsync(Guid userId);
    }
}