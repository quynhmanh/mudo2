using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Nest;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class DesignService : ServiceBase
    {
        const string DefaultIndex = "design-06";
        private DesignContext _designContext;

        public DesignService(DesignContext designContext)
        {
            _designContext = designContext;
        }

        public virtual Result<List<DesignModel>> Search(string type = null)
        {
            if (!string.IsNullOrEmpty(type))
            {
                var result =
                    _designContext.Designs
                    .Where(x => x.Type == type)
                    .ToList();

                return Ok(result);
            }
            return Ok(_designContext.Designs.ToList());
        }

        public virtual Result<DesignModel> Get(string id)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var response = client.Get<DesignModel>(id);

            if (response.Found) {
                return Ok(response.Source);
            } else {
                return Error<DesignModel>("");
            }
        }

        public virtual async Task<Result<string>> Add(DesignModel model)
        {
            if (model == null)
                return Error<string>();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index(DefaultIndex));

            return Ok(model.Id);
        }

        public virtual Infrastructure.Result UpdateRepresentative(string id, string filePath)
        {
            var design = _designContext.Designs.Where(x => x.Id == id).FirstOrDefault();
            if (design == null)
            {
                return Error($"Design with id = {id} not found.");
            }

            design.Representative = filePath;
            _designContext.SaveChanges();

            var node = new Uri("http://192.168.0.1:9200");
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(design, idx => idx.Index(DefaultIndex));


            return Ok();
        }

        public virtual Result<KeyValuePair<List<DesignModel>, long>> SearchWithUserName(string userName, int page = 1, int perPage = 5)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex)
                .DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 3));
            var client = new ElasticClient(settings);
            string query = $"UserName:{userName}";

            var res = client.Search<DesignModel>(s => 
            s.Query(q => q.Match(c => c.Field(p => p.UserName).Query(userName))).From((page - 1) * perPage)
                .Size(perPage));

            var res2 = new KeyValuePair<List<DesignModel>, long>(res.Documents.ToList(), res.Total);

            return Ok(res2);
        }

        public virtual Infrastructure.Result Update(DesignModel model)
        {
            if (model == null)
                return Error();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<DesignModel>(model.Id);

            var template = getResponse.Source;

            template.Title = model.Title;
            template.Document = model.Document;
            template.CreatedAt = model.CreatedAt;
            template.CreatedBy = model.CreatedBy;
            template.UpdatedAt = model.UpdatedAt;
            template.UpdatedBy = model.UpdatedBy;
            template.FontList = model.FontList;
            template.Type = model.Type;
            template.Width = model.Width;
            template.Height = model.Height;
            template.Keywords = model.Keywords;
            template.FirstName = model.FirstName;
            template.Representative = model.Representative;
            template.Representative2 = model.Representative2;
            template.IsVideo = model.IsVideo;
            template.VideoRepresentative = model.VideoRepresentative;
            template.Pages = model.Pages;

            var updateResponse = client.Update<DesignModel>(template, u => u.Doc(template));

            return Ok();
        }

        //public virtual Result Update(PersonModel model)
        //{
        //    if (model == null)
        //        return Error();
        //    if (model.Id <= 0)
        //        return Error($"{model.Id} <= 0.");
        //    var person = _personContext.Persons.Where(x => x.Id == model.Id).FirstOrDefault();
        //    if (person == null)
        //        return Error($"Person with id = {model.Id} not found.");

        //    TrimStrings(model);

        //    var personExists =
        //        _personContext.Persons
        //        .Any(x =>
        //            x.Id != model.Id &&
        //            x.FirstName == model.FirstName &&
        //            x.LastName == model.LastName
        //            );
        //    if (personExists)
        //    {
        //        return Error("Person with the same first name and last name already exists.");
        //    }

        //    person.FirstName = model.FirstName;
        //    person.LastName = model.LastName;
        //    _personContext.SaveChanges();

        //    return Ok();
        //}

        //public virtual Result Delete(int id)
        //{
        //    var unit = _personContext.Persons.Where(x => x.Id == id).FirstOrDefault();
        //    if (unit == null)
        //        return Error($"Can't find person with Id = {id}.");
        //    _personContext.Persons.Remove(unit);
        //    _personContext.SaveChanges();
        //    return Ok();
        //}

        //private static void TrimStrings(PersonModel model)
        //{
        //    model.FirstName = model.FirstName.Trim();
        //    model.LastName = model.LastName.Trim();
        //}
    }
}
