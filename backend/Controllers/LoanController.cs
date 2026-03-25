using backend.Constants;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanController : ControllerBase
    {
        private readonly IDecisionEngine _decisionEngine;

        public LoanController(IDecisionEngine decisionEngine)
        {
            _decisionEngine = decisionEngine;
        }

        [HttpPost("decision")]
        public ActionResult<LoanResponse> EvaluateLoan([FromBody] LoanRequest request)
        {
            var result = _decisionEngine.EvaluateLoan(request);
            return Ok(result);
        }

        [HttpGet("constraints")]
        public ActionResult<ConstraintsResponse> GetConstraints() =>
            Ok(new ConstraintsResponse
            {
                MinAmount = LoanConstraints.MinAmount,
                MaxAmount = LoanConstraints.MaxAmount,
                MinPeriod = LoanConstraints.MinPeriod,
                MaxPeriod = LoanConstraints.MaxPeriod,
            });

        [HttpGet("preview")]
        public ActionResult<PreviewResponse> GetPreview(
            [FromQuery] string personalCode,
            [FromQuery] decimal amount,
            [FromQuery] int period)
        {
            double? score = _decisionEngine.CalculatePreviewScore(personalCode, amount, period);
            return Ok(new PreviewResponse { CreditScore = score });
        }
    }
}