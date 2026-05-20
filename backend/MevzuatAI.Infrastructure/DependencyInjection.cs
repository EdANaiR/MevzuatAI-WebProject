using MevzuatAI.Application;
using MevzuatAI.Application.Repositories;
using MevzuatAI.Application.Services;
using MevzuatAI.Infrastructure.Persistence;
using MevzuatAI.Infrastructure.Persistence.Repositories;
using MevzuatAI.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pgvector.EntityFrameworkCore;
using MevzuatAI.Application.Common.Interfaces;    
namespace MevzuatAI.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    npgsqlOptions => npgsqlOptions.UseVector()
                ));

            services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPetitionRepository, PetitionRepository>();

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPetitionService, PetitionService>();

            services.AddScoped<IAIService, GeminiService>();

            return services;
        }
    }
}
