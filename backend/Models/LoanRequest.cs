namespace backend.Models
{
    public class LoanRequest
    {
       public required string PersonalCode { get; set; }
       public int Amount { get; set; }
       public int LoanPeriod { get; set; }
    }
}