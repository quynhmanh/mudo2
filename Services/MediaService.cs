using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nest;
using NpgsqlTypes;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;

namespace RCB.TypeScript.Services
{
    public class MediaService : ServiceBase
    {
        private MediaContext _mediaContext;

        public MediaService(MediaContext mediaContext)
        {
            _mediaContext = mediaContext;
        }

        public virtual Result<int> Add(MediaModel model)
        {
            //_mediaContext.Medias.Add(model);
            //_mediaContext.SaveChanges();

            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index("media")); //or specify index via settings.DefaultIndex("mytweetindex");

            return Ok(1);
        }

        public virtual Result<int> RemoveAll()
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("media");
            var client = new ElasticClient(settings);

            var res = client.DeleteByQuery<MediaModel>(q => q.MatchAll());
            return Ok(1);
        }

        class UpdateDocumentAttributes
        {
            public string id { get; set; }
            public string name { get; set; }
            public string original_voice_actor { get; set; }
            public string animated_debut { get; set; }
        }

        public virtual Result<int> Edit(MediaModel model)
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("media");
            var client = new ElasticClient(settings);

            var getResponse = client.Get<MediaModel>(model.Id);

            var page = getResponse.Source;

            page.FirstName = model.FirstName;
            page.Keywords = model.Keywords;

            var updateResponse = client.Update<MediaModel>(page, u => u.Doc(page));


            return Ok(1);
        }

        public virtual Result<int> Delete(string id)
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("media");
            var client = new ElasticClient(settings);

            var getResponse = client.Delete<MediaModel>(id);

            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<MediaModel>, long>> Search(int type, int page, int perPage, string terms = "")
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("media").DisableDirectStreaming();
            var client = new ElasticClient(settings);

            string query = $"type:{type}";

            var res = client.Search<MediaModel>(s => s.Query(q => q.QueryString(d => d.Query(query))));
            var res3 = client.Search<MediaModel>(s => s.Query(q => q.Match(d => d.Query(query))));
            var res4 = client.Search<MediaModel>(s => s.
                Query(q => q.
                    Bool(d => d.
                        Must(
                            e => e.Match(ee => ee.Field(f => f.Type).Query(type.ToString())) &&
                            (e.Match(ee => ee.Field(f => f.Keywords).Query(terms)) ||
                            e.Match(ee => ee.Field(f => f.FirstName).Query(terms))
                            )
                            )
                        )
                    ).
                From((page - 1) * perPage).
                Size(perPage)
                );

            var res2 = new KeyValuePair<List<MediaModel>, long>(res4.Documents.ToList(), res4.Total);

            return Ok(res2);
        }


    }
}
