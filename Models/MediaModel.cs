namespace RCB.TypeScript.Models
{
    public class MediaModel : Base
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Representative { get; set; }
        public string RepresentativeThumbnail { get; set; }
        public string RepresentativeRemoveBackground { get; set; }
        public float Width { get; set; }
        public float height { get; set; }
        public int Type { get; set; }
        public string[] Keywords { get; set; }
        public NpgsqlTypes.NpgsqlTsVector query { get; set; }
        public string Color { get; set; }
        public string UserEmail { get; set; }
        public string Ext { get; set; }
        public string RepresentativeRemoveBackgroundSVG { get; set; }
        public float Duration { get; set; }
        public string ClipId { get; set; }
        public float ClipWidth { get; set; }
        public float ClipHeight { get; set; }
        public string Path { get; set; }
        public string Path2 { get; set; }

        public MediaModel(string id, string firstName, string lastName, string representative)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Representative = representative;
            Keywords = new string[] { };
        }

        public MediaModel()
        {

        }
    }
}
