namespace backend.Models
{
    public class ConstraintsResponse
    {
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
        public int MinPeriod { get; set; }
        public int MaxPeriod { get; set; }
    }
}
