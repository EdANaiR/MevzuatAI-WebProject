using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MevzuatAI.Infrastructure.Persistence;

namespace MevzuatAI.WebAPI 
{
    public class ContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Docker bağlantı adresi
            var connectionString = "Host=localhost;Port=5432;Database=MevzuatDb;Username=postgres;Password=mysecretpassword;";

            optionsBuilder.UseNpgsql(connectionString, x =>
            {
                x.UseVector(); 
            });

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}