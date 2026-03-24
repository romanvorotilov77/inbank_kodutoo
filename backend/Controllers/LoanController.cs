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

        // Внедряем нашу бизнес-логику через конструктор
        public LoanController(IDecisionEngine decisionEngine)
        {
            _decisionEngine = decisionEngine;
        }

        [HttpPost("decision")] // Полный путь: POST /api/loan/decision
        public ActionResult<LoanResponse> GetDecision([FromBody] LoanRequest request)
        {
            // Передаем данные из запроса в наш сервис и возвращаем результат
            var result = _decisionEngine.EvaluateLoan(request);
            return Ok(result);
        }
    }
}