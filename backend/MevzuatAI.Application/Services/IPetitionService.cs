using MevzuatAI.Application.DTOs;

namespace MevzuatAI.Application.Services
{
    public interface IPetitionService
    {
        // Kullanıcının tüm dilekçelerini getir
        Task<List<PetitionResponseDto>> GetUserPetitionsAsync(Guid userId);

        // Tek dilekçe getir
        Task<PetitionResponseDto?> GetPetitionByIdAsync(Guid petitionId, Guid userId);

        // Yeni dilekçe oluştur
        Task<PetitionResponseDto> CreatePetitionAsync(Guid userId, CreatePetitionDto request);

        // Dilekçe güncelle
        Task<PetitionResponseDto> UpdatePetitionAsync(Guid petitionId, Guid userId, UpdatePetitionDto request);

        // Dilekçe sil
        Task DeletePetitionAsync(Guid petitionId, Guid userId);
        
        //Pdf inince completed 
        Task<bool> MarkAsCompletedAsync(Guid petitionId, Guid userId);
    }
}