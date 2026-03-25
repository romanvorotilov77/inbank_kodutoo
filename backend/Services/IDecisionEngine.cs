using backend.Models;

namespace backend.Services
{
    public interface IDecisionEngine
    {
        LoanResponse EvaluateLoan(LoanRequest request);
        double? CalculatePreviewScore(string personalCode, decimal amount, int period);
    }
}