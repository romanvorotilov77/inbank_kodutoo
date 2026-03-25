using backend.Models;
using backend.Constants;

namespace backend.Services
{
    public class DecisionEngine : IDecisionEngine
    {
        private readonly IUserService _userService;

        public DecisionEngine(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        public LoanResponse EvaluateLoan(LoanRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (request.LoanPeriod < LoanConstraints.MinPeriod || request.LoanPeriod > LoanConstraints.MaxPeriod)
                return SendRejectResponse();

            if (request.Amount < LoanConstraints.MinAmount || request.Amount > LoanConstraints.MaxAmount)
                return SendRejectResponse();

            if (_userService.HasDebt(request.PersonalCode))
                return SendRejectResponse();

            int? creditModifier = _userService.GetCreditModifier(request.PersonalCode);
            if (!creditModifier.HasValue)
                return SendRejectResponse();

            decimal? maxApprovedAmount = FindMaxApprovedAmount(creditModifier.Value, request.LoanPeriod);

            if (maxApprovedAmount.HasValue)
            {
                double score = CalculateCreditScore(creditModifier.Value, maxApprovedAmount.Value, request.LoanPeriod);
                return SendApproveResponse(maxApprovedAmount.Value, null, score);
            }

            var alternative = FindMaxApprovedAmountWithAlternativePeriod(creditModifier.Value, request.LoanPeriod);

            if (alternative.HasValue)
            {
                double score = CalculateCreditScore(creditModifier.Value, alternative.Value.Amount, alternative.Value.Period);
                return SendApproveResponse(alternative.Value.Amount, alternative.Value.Period, score);
            }

            return SendRejectResponse();
        }

        public double? CalculatePreviewScore(string personalCode, decimal amount, int period)
        {
            if (_userService.HasDebt(personalCode))
                return null;

            int? creditModifier = _userService.GetCreditModifier(personalCode);
            if (!creditModifier.HasValue || amount <= 0)
                return null;

            return CalculateCreditScore(creditModifier.Value, amount, period);
        }

        private static decimal? FindMaxApprovedAmount(int creditModifier, int loanPeriod)
        {
            decimal max = Math.Min((decimal)creditModifier * loanPeriod, LoanConstraints.MaxAmount);
            return max >= LoanConstraints.MinAmount ? max : null;
        }

        private static (decimal Amount, int Period)? FindMaxApprovedAmountWithAlternativePeriod(
            int creditModifier, int requestedPeriod)
        {
            for (int period = requestedPeriod + 1; period <= LoanConstraints.MaxPeriod; period++)
            {
                decimal? max = FindMaxApprovedAmount(creditModifier, period);
                if (max.HasValue)
                    return (max.Value, period);
            }
            return null;
        }

        private static double CalculateCreditScore(int creditModifier, decimal loanAmount, int loanPeriod) =>
            ((double)creditModifier / (double)loanAmount) * loanPeriod;

        private static LoanResponse SendRejectResponse() =>
            new() { IsApproved = false };

        private static LoanResponse SendApproveResponse(decimal amount, int? period, double score) =>
            new() { IsApproved = true, ApprovedAmount = amount, ApprovedPeriod = period, ApprovedCreditScore = score };
    }
}
