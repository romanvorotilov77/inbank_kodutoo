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
    }
}