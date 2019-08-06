using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RCB.TypeScript.Models
{
    public class DesignModel
    {
        [Key]
        public string Id { get; set; }

        public string Type { get; set; }

        [Column(TypeName = "jsonb")]
        public string Document { get; set; }

        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public int UpdatedBy { get; set; }

        public string Representative { get; set; }


        public DesignModel()
        {

        }

        public DesignModel(string id, string document, DateTime createdAt, int createdBy, DateTime updatedAt, int updatedBy, string representative)
        {
            Id = id;
            Document = document;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
            Representative = representative;
        }
    }
}
