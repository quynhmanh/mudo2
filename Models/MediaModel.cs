﻿namespace RCB.TypeScript.Models
{
    public class MediaModel
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Representative { get; set; }
        public float Width { get; set; }
        public float height { get; set; }
        public int Type { get; set; }
        public string[] Keywords { get; set; }
        public NpgsqlTypes.NpgsqlTsVector query { get; set; }
        public string Color { get; set; }

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
