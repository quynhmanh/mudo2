using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class TemplateService : ServiceBase
    {
        private TemplateContext _templateContext;

        public TemplateService(TemplateContext templateContext)
        {
            _templateContext = templateContext;
        }

        public virtual Result<KeyValuePair<List<TemplateModel>, int>> Search(string type = null, int page = 1, int perPage = 5)
        {
            List<TemplateModel> templates = _templateContext.Templates.Where(template => template.Type == type).ToList();
            var result = new KeyValuePair<List<TemplateModel>, int>(templates.Skip((page - 1) * perPage).Take(perPage).ToList(), templates.Count);
            return Ok(result);
        }

        public virtual Result<TemplateModel> Get(string id)
        {
            var exist = _templateContext.Templates.Any(template => template.Id == id);
            if (!exist)
            {
                return Error<TemplateModel>($"Template with {id} not found.");
            }
            return Ok(_templateContext.Templates.Where(template => template.Id == id).First());
        }

        public virtual Result<string> Add(TemplateModel model)
        {
            if (model == null)
                return Error<string>();

            model.Id = Guid.NewGuid().ToString();

            _templateContext.Templates.Add(model);
            _templateContext.SaveChanges();


            return Ok(model.Id);
        }

        public virtual Result Update(TemplateModel model)
        {
            if (model == null)
                return Error();
            var template = _templateContext.Templates.Where(x => x.Id == model.Id).FirstOrDefault();
            if (template == null)
                return Error($"Template with id = {model.Id} not found.");
            //if (template.Type != model.Type)
            //{
            //    return Error($"Do not allow to update type of template {model.Id}.");
            //}
            template.Document = model.Document;
            template.CreatedAt = model.CreatedAt;
            template.CreatedBy = model.CreatedBy;
            template.UpdatedAt = model.UpdatedAt;
            template.UpdatedBy = model.UpdatedBy;
            template.FontList = model.FontList;
            template.Type = model.Type;
            template.Width = model.Width;
            template.Height = model.Height;

            _templateContext.SaveChanges();

            return Ok();
        }

        public virtual Result Delete(string id)
        {
            var unit = _templateContext.Templates.Where(x => x.Id == id).FirstOrDefault();
            if (unit == null)
                return Error($"Can't find template with Id = {id}.");
            _templateContext.Templates.Remove(unit);
            _templateContext.SaveChanges();
            return Ok();
        }

        public virtual Result UpdateRepresentative(string id, string filePath)
        {
            var template = _templateContext.Templates.Where(x => x.Id == id).FirstOrDefault();
            if (template == null)
            {
                return Error($"Template with id = {id} not found.");
            }

            template.Representative = filePath;
            _templateContext.SaveChanges();

            return Ok();
        }

        //private static void TrimStrings(PersonModel model)
        //{
        //    model.FirstName = model.FirstName.Trim();
        //    model.LastName = model.LastName.Trim();
        //}
    }
}
