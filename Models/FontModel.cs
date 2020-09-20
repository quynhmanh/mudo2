namespace RCB.TypeScript.Models
{
    public class FontModel : Base
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Representative { get; set; }

        public bool VietnameseSupport { get; set; }
        public int FontPickerHeight{ get; set; }

        public FontModel(string id, string firstName, string lastName, string representative)
        {
            Id = id;
            Representative = representative;
            VietnameseSupport = false;
        }

        public FontModel()
        {

        }
    }
}
