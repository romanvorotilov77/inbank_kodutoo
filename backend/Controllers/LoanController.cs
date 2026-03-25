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
        private readonly IUserService _userService;

        public LoanController(IDecisionEngine decisionEngine, IUserService userService)
        {
            _decisionEngine = decisionEngine;
            _userService = userService;
        }

        [HttpPost("decision")]
        public ActionResult<LoanResponse> EvaluateLoan([FromBody] LoanRequest request)
        {
            var result = _decisionEngine.EvaluateLoan(request);
            return Ok(result);
        }

        [HttpGet("sample-codes")]
        public ActionResult<IReadOnlyList<SampleUserCode>> GetSampleCodes()
        {
            return Ok(_userService.GetSampleUserCodes());
        }
    }
}