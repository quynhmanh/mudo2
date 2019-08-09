using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Nest;

namespace RCB.TypeScript.Models
{
    [ElasticsearchType(RelationName = "template")]
    public class TemplateModel
    {
        [Key]
        public string Id { get; set; }

        public string Type { get; set; }
        public string SubType { get; set; }

        public string[] Keywords { get; set; }

        [Column(TypeName = "jsonb")]
        public string Document { get; set; }

        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public int UpdatedBy { get; set; }

        public string Representative { get; set; }
        public string[] FontList { get; set; }

        public float Width { get; set; }
        public float Height { get; set; }

        public string FirstName { get; set; }
        public string FilePath { get; set; }

        [Text(Name = "filePath.tree")]
        public string FilePathTree { get; set; }

        public TemplateModel()
        {

        }

        public TemplateModel(string id, string document, DateTime createdAt, int createdBy, DateTime updatedAt, int updatedBy, string representative, float width, float height)
        {
            Id = id;
            Document = document;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
            Representative = representative;
            FontList = new string[0];
            Width = width;
            Height = height;
        }
    }
}
