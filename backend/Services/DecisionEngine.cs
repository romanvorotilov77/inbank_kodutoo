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
            if(request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }
            
            if(request.LoanPeriod < LoanConstraints.MinPeriod || request.LoanPeriod > LoanConstraints.MaxPeriod)
            {
                return SendRejectResponse();
            }
            
            if(request.Amount > LoanConstraints.MaxAmount || request.Amount < LoanConstraints.MinAmount)
            {
                return SendRejectResponse();
            }
            
            if(_userService.HasDebt(request.PersonalCode))
            {
                return SendRejectResponse();
            }
            
            int? creditModifier = _userService.GetCreditModifier(request.PersonalCode);
            if(!creditModifier.HasValue)
            {
                return SendRejectResponse();
            }
            
            int? maxApprovedAmount = FindMaxApprovedAmount(creditModifier.Value, request.LoanPeriod);
            
            if(maxApprovedAmount.HasValue)
            {
                return SendApproveResponse(maxApprovedAmount.Value);
            }
            
            int? alternativeAmount = FindMaxApprovedAmountWithAlternativePeriod(creditModifier.Value, request.Amount);
            
            if(alternativeAmount.HasValue)
            {
                return SendApproveResponse(alternativeAmount.Value);
            }
            
            return SendRejectResponse();
        }

        private int? FindMaxApprovedAmount(int creditModifier, int loanPeriod)
        {
            // Start from maxAmount and go down to find the highest amount with score >= 1
            for(int amount = LoanConstraints.MaxAmount; amount >= LoanConstraints.MinAmount; amount -= 100)
            {
                if(CalculateCreditScore(creditModifier, amount, loanPeriod) >= 1)
                {
                    return amount;
                }
            }
            
            for(int amount = LoanConstraints.MaxAmount; amount >= LoanConstraints.MinAmount; amount--)
            {
                if(CalculateCreditScore(creditModifier, amount, loanPeriod) >= 1)
                {
                    return amount;
                }
            }
            
            return null;
        }

        private int? FindMaxApprovedAmountWithAlternativePeriod(int creditModifier, int requestedAmount)
        {
            // Try periods from maximum to minimum to find a suitable one
            for(int period = LoanConstraints.MaxPeriod; period >= LoanConstraints.MinPeriod; period--)
            {
                // For each period, find the max approvable amount
                int? maxApproved = FindMaxApprovedAmount(creditModifier, period);
                
                if(maxApproved.HasValue)
                {
                    return maxApproved.Value;
                }
            }
            
            return null;
        }

        private double CalculateCreditScore(int creditModifier, int loanAmount, int loanPeriod)
        {
            return ((double)creditModifier / loanAmount) * loanPeriod;
        }

        private LoanResponse SendRejectResponse()
        {
            return new LoanResponse
            {
                IsApproved = false,
                ApprovedAmount = 0
            };
        }

        private LoanResponse SendApproveResponse(int approvedAmount)
        {
            return new LoanResponse
            {
                IsApproved = true,
                ApprovedAmount = approvedAmount
            };
        }
    }
}


