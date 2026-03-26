using backend.Constants;
using backend.Models;
using backend.Services;
using Xunit;

namespace backend.Tests
{
    public class DecisionEngineTests
    {
        private readonly DecisionEngine _engine;

        public DecisionEngineTests()
        {
            _engine = new DecisionEngine(new UserService());
        }

        [Fact]
        public void EvaluateLoan_DebtUser_ReturnsRejected()
        {
            var req = new LoanRequest { PersonalCode = "49002010965", Amount = 5000m, LoanPeriod = 24 };
            var res = _engine.EvaluateLoan(req);
            Assert.False(res.IsApproved);
            Assert.Null(res.ApprovedAmount);
        }

        [Fact]
        public void EvaluateLoan_UnknownPersonalCode_ReturnsRejected()
        {
            var req = new LoanRequest { PersonalCode = "00000000000", Amount = 5000m, LoanPeriod = 24 };
            var res = _engine.EvaluateLoan(req);
            Assert.False(res.IsApproved);
        }

        [Fact]
        public void EvaluateLoan_NullRequest_ThrowsArgumentNullException()
        {
            Assert.Throws<ArgumentNullException>(() => _engine.EvaluateLoan(null!));
        }

        [Fact]
        public void EvaluateLoan_PeriodTooShort_ReturnsRejected()
        {
            var req = new LoanRequest { PersonalCode = "49002010987", Amount = 5000m, LoanPeriod = 6 };
            var res = _engine.EvaluateLoan(req);
            Assert.False(res.IsApproved);
        }

        [Fact]
        public void EvaluateLoan_AmountTooLow_ReturnsRejected()
        {
            var req = new LoanRequest { PersonalCode = "49002010987", Amount = 500m, LoanPeriod = 24 };
            var res = _engine.EvaluateLoan(req);
            Assert.False(res.IsApproved);
        }

        [Fact]
        public void EvaluateLoan_Segment1Period12_FindsAlternativePeriod20()
        {
            var req = new LoanRequest { PersonalCode = "49002010976", Amount = 5000m, LoanPeriod = 12 };
            var res = _engine.EvaluateLoan(req);
            Assert.True(res.IsApproved);
            Assert.Equal(2000m, res.ApprovedAmount);
            Assert.Equal(20, res.ApprovedPeriod);
        }

        [Fact]
        public void EvaluateLoan_Segment2Period24_ApprovesAt7200()
        {
            var req = new LoanRequest { PersonalCode = "49002010987", Amount = 5000m, LoanPeriod = 24 };
            var res = _engine.EvaluateLoan(req);
            Assert.True(res.IsApproved);
            Assert.Equal(7200m, res.ApprovedAmount);
            Assert.Null(res.ApprovedPeriod);
        }

        [Fact]
        public void EvaluateLoan_Segment3Period12_CappedAtMaxAmount()
        {
            var req = new LoanRequest { PersonalCode = "49002010998", Amount = 5000m, LoanPeriod = 12 };
            var res = _engine.EvaluateLoan(req);
            Assert.True(res.IsApproved);
            Assert.Equal(LoanConstraints.MaxAmount, res.ApprovedAmount);
        }

        [Fact]
        public void EvaluateLoan_BoundaryScoreExactlyOne_IsApproved()
        {
            var req = new LoanRequest { PersonalCode = "49002010976", Amount = 2000m, LoanPeriod = 20 };
            var res = _engine.EvaluateLoan(req);
            Assert.True(res.IsApproved);
            Assert.NotNull(res.ApprovedCreditScore);
            Assert.Equal(1.0, res.ApprovedCreditScore!.Value, precision: 10);
        }
    }
}
