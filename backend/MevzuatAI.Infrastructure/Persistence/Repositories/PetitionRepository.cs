using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MevzuatAI.Application.Repositories;
using MevzuatAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MevzuatAI.Infrastructure.Persistence.Repositories
{
    public class PetitionRepository : GenericRepository<Petition>, IPetitionRepository
    {
        public PetitionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Petition>> GetByUserIdAsync(Guid userId)
        {
            return await DbSet
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }
    }
}
