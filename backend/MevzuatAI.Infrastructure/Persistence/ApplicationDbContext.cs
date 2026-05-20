using MevzuatAI.Application;
using MevzuatAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace MevzuatAI.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Petition> Petitions { get; set; } = null!;
        public DbSet<LawArticle> LawArticles { get; set; } = null!;
        public DbSet<PetitionTemplate> PetitionTemplates { get; set; } = null!;

       
        private static readonly ValueConverter<float[]?, Vector> VectorConverter =
            new(
                v => new Vector(v!),
                v => v.ToArray()
            );

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL pgvector extension
            modelBuilder.HasPostgresExtension("vector");

            ConfigureUser(modelBuilder);
            ConfigurePetition(modelBuilder);
            ConfigurePetitionTemplate(modelBuilder);
            ConfigureLawArticle(modelBuilder);
        }

        private static void ConfigureUser(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<User>();

            entity.HasKey(e => e.Id);

            entity.Property(e => e.FirstName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.LastName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Email)
                  .IsRequired()
                  .HasMaxLength(256);

            entity.Property(e => e.PasswordHash)
                  .IsRequired();

            entity.HasMany(e => e.Petitions)
                  .WithOne(p => p.User)
                  .HasForeignKey(p => p.UserId);
        }

        private static void ConfigurePetition(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<Petition>();

            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserPrompt)
                  .IsRequired();

            entity.Property(e => e.GeneratedPdfPath)
                  .IsRequired();

            entity.Property(e => e.Status)
                  .IsRequired();
        }

        private static void ConfigurePetitionTemplate(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<PetitionTemplate>();

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(e => e.Category)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.TemplateContent)
                  .IsRequired();

            entity.Property(e => e.RequiredInputs)
                  .IsRequired();

            // pgvector mapping (float[] -> vector)
            entity.Property(e => e.VectorData)
                  .HasConversion(VectorConverter)
                  .HasColumnType("vector(1536)");
        }

        private static void ConfigureLawArticle(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<LawArticle>();

            entity.HasKey(e => e.Id);

            entity.Property(e => e.LawName)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(e => e.ArticleNumber)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.Property(e => e.Content)
                  .IsRequired();

            // pgvector mapping (float[] -> vector)
            entity.Property(e => e.VectorData)
                  .HasConversion(VectorConverter)
                  .HasColumnType("vector(1536)");
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
