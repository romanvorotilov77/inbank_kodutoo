using backend.Models;

namespace backend.Services
{
    public interface IDecisionEngine
    {
        LoanResponse EvaluateLoan(LoanRequest request);
    }
}