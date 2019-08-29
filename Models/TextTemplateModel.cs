using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RCB.TypeScript.Models
{
    public class TextTemplateModel : Base
    {
        [Key]
        public string Id { get; set; }

        [Column(TypeName = "jsonb")]
        public string Document { get; set; }

        public TextTemplateModel()
        {

        }

        public TextTemplateModel(string id, string document, DateTime createdAt, int createdBy, DateTime updatedAt, int updatedBy)
        {
            Id = id;
            Document = document;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
        }
    }
}
