using MevzuatAI.Domain.Entities;

namespace MevzuatAI.Application.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}