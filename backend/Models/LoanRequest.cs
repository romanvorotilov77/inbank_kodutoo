namespace backend.Models
{
    public class LoanRequest
    {
       public required string PersonalCode { get; set; }
       public decimal Amount { get; set; }
       public int LoanPeriod { get; set; }
    }
}