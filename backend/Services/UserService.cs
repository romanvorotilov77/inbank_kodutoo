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

        public int? GetCreditModifier(string personalCode)
        {
            return _creditModifiers.TryGetValue(personalCode, out var modifier) ? modifier : null;
        }

        public bool HasDebt(string personalCode)
        {
            return _debtUsers.Contains(personalCode);
        }
    }
}
