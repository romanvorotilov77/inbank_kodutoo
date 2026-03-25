using backend.Models;

namespace backend.Services
{
    public interface IUserService
    {
        int? GetCreditModifier(string personalCode);
        bool HasDebt(string personalCode);
        IReadOnlyList<SampleUserCode> GetSampleUserCodes();
    }
}
