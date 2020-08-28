using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Nest;

namespace RCB.TypeScript.Models
{

    public interface ITemplateBaseModel
    {
        string Title { get; set; }

        [Ignore]
        string[] Canvas { get; set; }

        [Ignore]
        string[] Canvas2 { get; set; }

        float Width { get; set; }
        float Height { get; set; }

        string[] FontList { get; set; }

        [Ignore]
        string AdditionalStyle { get; set; }
    }

    [ElasticsearchType(RelationName = "template")]
    public class TemplateModel : Base, ITemplateBaseModel
    {
        public string Title { get; set; }
        [Key]
        public string Id { get; set; }

        public string Type { get; set; }

        [Keyword]
        public string SubType { get; set; }

        public string[] Keywords { get; set; }

        [Column(TypeName = "jsonb")]
        public string Document { get; set; }

        public string Representative { get; set; }
        public string Representative2 { get; set; }
        public string VideoRepresentative { get; set; }
        public string[] FontList { get; set; }

        public float Width { get; set; }
        public float Height { get; set; }

        public string FirstName { get; set; }
        public string FilePath { get; set; }

        public string[] Pages { get; set; }

        public int? PrintType { get; set; }

        [Text(Name = "filePath.tree")]
        public string FilePathTree { get; set; }

        [Ignore]
        public string[] Canvas { get; set; }

        [Ignore]
        public string[] Canvas2 { get; set; }

        [Ignore]
        public string AdditionalStyle { get; set; }

        public bool IsVideo { get; set; }

        public string UserName { get; set; } 

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
