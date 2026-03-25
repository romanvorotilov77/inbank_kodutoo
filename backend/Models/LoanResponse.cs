namespace backend.Models
{
    public class LoanResponse
    {
        
        public bool IsApproved { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public int? ApprovedPeriod { get; set; }
        public double? ApprovedCreditScore { get; set; }
    }
}