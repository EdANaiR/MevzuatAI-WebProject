using Microsoft.EntityFrameworkCore;
using MevzuatAI.Application.DTOs;
using MevzuatAI.Application.Services;
using MevzuatAI.Domain.Entities;
using MevzuatAI.Domain.Enums;
using MevzuatAI.Infrastructure.Persistence;

namespace MevzuatAI.Infrastructure.Services
{
    public class PetitionService : IPetitionService
    {
        private readonly ApplicationDbContext _context;

        public PetitionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PetitionResponseDto>> GetUserPetitionsAsync(Guid userId)
        {
            return await _context.Petitions
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new PetitionResponseDto
                {
                    Id = p.Id,
                    UserPrompt = p.UserPrompt,
                    GeneratedPdfPath = p.GeneratedPdfPath,
                    Status = (int)p.Status,
                    UserId = p.UserId,
                    TemplateId = p.TemplateId,
                    CreatedDate = p.CreatedDate,
                    UpdatedDate = p.UpdatedDate ?? DateTime.UtcNow,
                })
                .ToListAsync();
        }

        public async Task<PetitionResponseDto?> GetPetitionByIdAsync(Guid petitionId, Guid userId)
        {
            var petition = await _context.Petitions
                .FirstOrDefaultAsync(p => p.Id == petitionId && p.UserId == userId);

            if (petition == null) return null;

            return MapToDto(petition);
        }

        public async Task<PetitionResponseDto> CreatePetitionAsync(Guid userId, CreatePetitionDto request)
        {
            var petition = new Petition
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                UserPrompt = request.UserPrompt,
                GeneratedPdfPath = request.GeneratedPdfPath,
                TemplateId = request.TemplateId,
                Status = PetitionStatus.Draft,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
            };

            _context.Petitions.Add(petition);
            await _context.SaveChangesAsync();

            return MapToDto(petition);
        }

        public async Task<PetitionResponseDto> UpdatePetitionAsync(Guid petitionId, Guid userId, UpdatePetitionDto request)
        {
            var petition = await _context.Petitions
                .FirstOrDefaultAsync(p => p.Id == petitionId && p.UserId == userId)
                ?? throw new Exception("Dilekçe bulunamadı.");

            petition.Status = (PetitionStatus)request.Status;
            if (request.GeneratedPdfPath != null)
                petition.GeneratedPdfPath = request.GeneratedPdfPath;
            petition.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(petition);
        }

        public async Task DeletePetitionAsync(Guid petitionId, Guid userId)
        {
            var petition = await _context.Petitions
                .FirstOrDefaultAsync(p => p.Id == petitionId && p.UserId == userId)
                ?? throw new Exception("Dilekçe bulunamadı.");

            _context.Petitions.Remove(petition);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> MarkAsCompletedAsync(Guid petitionId, Guid userId)
        {
            var petition = await _context.Petitions
                .FirstOrDefaultAsync(p => p.Id == petitionId && p.UserId == userId);

            if (petition == null) return false;

            // Zaten Completed ise tekrar güncelleme
            if (petition.Status == PetitionStatus.Completed) return true;

            petition.Status = PetitionStatus.Completed;
            petition.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        private static PetitionResponseDto MapToDto(Petition p) => new()
        {
            Id = p.Id,
            UserPrompt = p.UserPrompt,
            GeneratedPdfPath = p.GeneratedPdfPath,
            Status = (int)p.Status,
            UserId = p.UserId,
            TemplateId = p.TemplateId,
            CreatedDate = p.CreatedDate,
            UpdatedDate = p.UpdatedDate ?? DateTime.UtcNow,
        };
    }
}