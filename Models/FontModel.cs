namespace RCB.TypeScript.Models
{
    public class FontModel : Base
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Representative { get; set; }

        public bool VietnameseSupport {get;set;}

        public FontModel(string id, string firstName, string lastName, string representative)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Representative = representative;
            VietnameseSupport = false;
        }

        public FontModel()
        {

        }
    }
}
