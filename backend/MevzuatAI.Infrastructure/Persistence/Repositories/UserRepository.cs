using System;
using System.Threading.Tasks;
using MevzuatAI.Application.Repositories;
using MevzuatAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MevzuatAI.Infrastructure.Persistence.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await DbSet.SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}
