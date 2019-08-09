using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nest;
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

        public virtual Result<KeyValuePair<List<TemplateModel>, int>> Search(string type = null, int page = 1, int perPage = 5, string filePath = "", string subType = "")
        {
            //List<TemplateModel> templates = _templateContext.Templates.Where(template => template.Type == type).ToList();
            //var result = new KeyValuePair<List<TemplateModel>, int>(templates.Skip((page - 1) * perPage).Take(perPage).ToList(), templates.Count);
            //return Ok(result);

            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template").DisableDirectStreaming();
            var client = new ElasticClient(settings);
            string query = $"type:{type}";

            var res = client.Search<TemplateModel>(s => s.
                Query(q => q.QueryString(d => d.Query(query)))
                .Aggregations(a => a.Terms("my_agg", t => t.Field("subType"))));

            var res2 = new KeyValuePair<List<TemplateModel>, int>(res.Documents.ToList(), res.Documents.Count);

            return Ok(res2);
        }

        public class ResultSearchAngAggregate
        {
            public int Count { get; set; }
            public List<TemplateModel> Documents { get; set; }
            public Dictionary<string, long?> Aggregation { get; set; }
        }

        public virtual Result<ResultSearchAngAggregate> SearchAngAggregate(string type = null, int page = 1, int perPage = 5, string filePath = "", string subType = "")
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template").DisableDirectStreaming();
            var client = new ElasticClient(settings);
            string query = $"type:{type}";

            var res = client.Search<TemplateModel>(s => s.
                                //Query(q => q.Term(t => t.Field(f => f.FilePathTree).Value(filePath)))
                                Query(q => q.Term(t => t.Field(f => f.FilePathTree).Value(filePath)))
                //Query(q => q.QueryString(q2 => q2.Query($"\"term\": {{ \"filePath.tree\": \"{filePath}\"}}\")))
                .Aggregations(a => a.Terms("my_agg", t => t.Field("subType"))));


            Dictionary<string, long?> aggregations = new Dictionary<string, long?>();

            foreach(var i in res.Aggregations.Terms("my_agg").Buckets)
            {
                aggregations.Add(i.Key, i.DocCount);
            }

            var res2 = new ResultSearchAngAggregate()
            {
                Count = res.Documents.ToList().Count,
                Documents = res.Documents.ToList(),
                Aggregation = aggregations,
            };

            return Ok(res2);
        }

        public virtual Result<TemplateModel> Get(string id)
        {
            //var exist = _templateContext.Templates.Any(template => template.Id == id);
            //if (!exist)
            //{
            //    return Error<TemplateModel>($"Template with {id} not found.");
            //}
            //return Ok(_templateContext.Templates.Where(template => template.Id == id).First());

            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template");
            var client = new ElasticClient(settings);

            var response = client.Get<TemplateModel>(id);

            return Ok(response.Source);
        }

        public virtual Result<string> Add(TemplateModel model)
        {
            if (model == null)
                return Error<string>();

            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index("template"));

            return Ok(response.Id);
        }

        public virtual Infrastructure.Result Update(TemplateModel model)
        {
            if (model == null)
                return Error();

            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template");
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(model.Id);

            var template = getResponse.Source;

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

            var updateResponse = client.Update<TemplateModel>(template, u => u.Doc(template));

            return Ok();
        }

        public virtual Infrastructure.Result Delete(string id)
        {
            var unit = _templateContext.Templates.Where(x => x.Id == id).FirstOrDefault();
            if (unit == null)
                return Error($"Can't find template with Id = {id}.");
            _templateContext.Templates.Remove(unit);
            _templateContext.SaveChanges();
            return Ok();
        }

        public virtual Infrastructure.Result UpdateRepresentative(string id, string filePath)
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template");
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(id);

            var page = getResponse.Source;

            page.Representative = filePath;
            var updateResponse = client.Update<TemplateModel>(page, u => u.Doc(page));

            return Ok();
        }

        //private static void TrimStrings(PersonModel model)
        //{
        //    model.FirstName = model.FirstName.Trim();
        //    model.LastName = model.LastName.Trim();
        //}

        public virtual Result<int> RemoveAll()
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template");
            var client = new ElasticClient(settings);

            var res = client.DeleteByQuery<TemplateModel>(q => q.MatchAll());
            return Ok(1);
        }

        public virtual Result<int> Edit(TemplateModel model)
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("template");
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(model.Id);

            var page = getResponse.Source;

            page.FirstName = model.FirstName;
            page.Keywords = model.Keywords;
            page.FilePath = model.FilePath;
            page.SubType = model.SubType;

            var updateResponse = client.Update<TemplateModel>(page, u => u.Doc(page));


            return Ok(1);
        }
    }
}
