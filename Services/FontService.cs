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
    public class FontService : ServiceBase
    {
        private FontContext _fontContext;

        public FontService(FontContext fontContext)
        {
            _fontContext = fontContext;
        }

        public virtual Result<int> Add(FontModel model)
        {
            var node = new Uri("http://host_container_address:9200");
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index("font"));

            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<FontModel>, long>> Search(string term = null, int page = 1, int perPage = 20)
        {
            var node = new Uri("http://host_container_address:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("font").DisableDirectStreaming();
            var client = new ElasticClient(settings);
            string query = $"*:*";

            var res = client.Search<FontModel>(s => s.Query(q => q.QueryString(d => d.Query(query))).From((page - 1) * perPage).Take(perPage));

            var res2 = new KeyValuePair<List<FontModel>, long>(res.Documents.ToList(), res.Total);
            return Ok(res2);
        }

        public virtual Infrastructure.Result Delete(string id)
        {
            var node = new Uri("http://host_container_address:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("font");
            var client = new ElasticClient(settings);

            var getResponse = client.Delete<TemplateModel>(id);

            return Ok();
        }

    }
}
