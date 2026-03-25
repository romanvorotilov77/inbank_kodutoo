using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoanRequest
    {
        public required string PersonalCode { get; set; }

        [Range(typeof(decimal), "2000", "10000")]
        public decimal Amount { get; set; }

        [Range(12, 60)]
        public int LoanPeriod { get; set; }
    }
}