using backend.Models;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly Dictionary<string, int> _creditModifiers = new()
        {
            { "49002010976", 100 },
            { "49002010987", 300 },
            { "49002010998", 1000 }
        };

        private readonly HashSet<string> _debtUsers = new()
        {
            "49002010965"
        };

        private readonly List<SampleUserCode> _sampleUserCodes = new()
        {
            new SampleUserCode { PersonalCode = "49002010965", Label = "49002010965 (debt)" },
            new SampleUserCode { PersonalCode = "49002010976", Label = "49002010976 (segment 1, 100)" },
            new SampleUserCode { PersonalCode = "49002010987", Label = "49002010987 (segment 2, 300)" },
            new SampleUserCode { PersonalCode = "49002010998", Label = "49002010998 (segment 3, 1000)" }
        };

        public int? GetCreditModifier(string personalCode)
        {
            return _creditModifiers.TryGetValue(personalCode, out var modifier) ? modifier : null;
        }

        public bool HasDebt(string personalCode)
        {
            return _debtUsers.Contains(personalCode);
        }

        public IReadOnlyList<SampleUserCode> GetSampleUserCodes()
        {
            return _sampleUserCodes;
        }
    }
}
