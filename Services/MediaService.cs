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

        const string DefaultIndex = "media-03";

        private MediaContext _mediaContext;

        public MediaService(MediaContext mediaContext)
        {
            _mediaContext = mediaContext;
        }

        public virtual Result<int> Add(MediaModel model)
        {
            //_mediaContext.Medias.Add(model);
            //_mediaContext.SaveChanges();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response2 = client.Indices.Create(DefaultIndex, c => c
                .Settings(s => s.Analysis(a => a.Analyzers(ar => ar.Custom("custom_path_tree", ac => ac.Tokenizer("custom_hierarchy")))))
                .Map<TemplateModel>(mm => mm.Properties(props => props
                    .Keyword(t => t.Name(p => p.SubType))
                    .Text(pt => pt.Name(ptp => ptp.FilePath).Fields(ptf => ptf.Text(ptft => ptft.Name("tree").Analyzer("custom_path_tree")))))));


            var response = client.Index(model, idx => idx.Index(DefaultIndex)); //or specify index via settings.DefaultIndex("mytweetindex");

            return Ok(1);
        }

        public virtual Result<MediaModel> Get(string id)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var response = client.Get<MediaModel>(id);

            return Ok(response.Source);
        }

        public virtual Infrastructure.Result Update(MediaModel model) {
            if (model == null)
                return Error();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<MediaModel>(model.Id);

            var template = getResponse.Source;

            template = model;

            template.Width = model.Width;
            template.Height = model.Height;
            template.Ext = model.Ext;
            template.RepresentativeThumbnail = model.RepresentativeThumbnail;
            template.Representative = model.Representative;
            
            var updateResponse = client.Update<MediaModel>(template, u => u.Doc(template));

            return Ok();
        }

        public virtual Result<int> RemoveAll()
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
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
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<MediaModel>(model.Id);

            var page = getResponse.Source;

            page.FirstName = model.FirstName;
            page.Keywords = model.Keywords;
            page.ClipId = model.ClipId;
            page.ClipWidth0 = model.ClipWidth0;
            page.ClipHeight0 = model.ClipHeight0;
            page.ClipWidth = model.ClipWidth;
            page.ClipHeight = model.ClipHeight;
            page.Path = model.Path;
            page.Path2 = model.Path2;
            page.Popularity = model.Popularity;
            page.Popularity2 = model.Popularity2;
            page.StopColor1 = model.StopColor1;
            page.StopColor2 = model.StopColor2;
            page.StopColor3 = model.StopColor3;
            page.StopColor4 = model.StopColor4;
            page.GridTemplateAreas = model.GridTemplateAreas;
            page.GridTemplateColumns = model.GridTemplateColumns;
            page.GridTemplateRows = model.GridTemplateRows;
            page.Gap = model.Gap;
            page.Grids = model.Grids;

            var updateResponse = client.Update<MediaModel>(page, u => u.Doc(page));

            return Ok(1);
        }

        public virtual Result<int> Delete(string id)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Delete<MediaModel>(id);

            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<MediaModel>, long>> Search(int type, int page, int perPage, string terms = "", string userEmail = "")
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex).DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 10));
            var client = new ElasticClient(settings);
            
            var res4 = client.Search<MediaModel>(s => s.
                Query(q => q.
                    Bool(d => d.
                        Must(
                            e => e.Match(ee => ee.Field(f => f.Type).Query(type.ToString())) &&
                            e.Match(ee => ee.Field(f => f.UserEmail).Query(userEmail.ToString())) &&
                            (e.Match(ee => ee.Field(f => f.Keywords).Query(terms)) ||
                            e.Match(ee => ee.Field(f => f.FirstName).Query(terms))
                            )
                            )
                        )
                    )
                    .Sort(f => f.Descending(ff => ff.Popularity))
                .From((page - 1) * perPage)
                .Size(perPage));

            var res2 = new KeyValuePair<List<MediaModel>, long>(res4.Documents.ToList(), res4.Total);

            return Ok(res2);
        }

        public virtual Result<KeyValuePair<List<MediaModel>, long>> InitSearch(int type, int page, int perPage, string terms = "", string userEmail = "")
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex).DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 10));
            var client = new ElasticClient(settings);

            var res4 = client.Search<MediaModel>(s => s.
                Query(q => q.MatchAll())
                .Sort(f => f.Descending(ff => ff.Popularity2))
                .Source(f => f.Includes(ff => ff.Fields(
                    p => p.Width, 
                    p => p.Height,
                    p => p.Representative, 
                    p => p.RepresentativeThumbnail,
                    p => p.Id,
                    p => p.Keywords,
                    p => p.Grids,
                    p => p.GridTemplateAreas,
                    p => p.GridTemplateColumns,
                    p => p.GridTemplateRows,
                    p => p.Gap,
                    p => p.Keywords[0] == "Shapes" ? p.Path : null
                )))
                .From(0)
                .Size(70));

            var res5 = client.Search<MediaModel>(s => s.
                Query(q => q.
                    Bool(d => d.
                        Must(
                            e => e.Match(ee => ee.Field(f => f.Keywords).Query("Shapes")))
                        )
                    )
                .Sort(f => f.Descending(ff => ff.Popularity2))
                .From(0)
                .Size(10));

            var res = res4.Documents.Concat(res5.Documents);

            var res2 = new KeyValuePair<List<MediaModel>, long>(res.ToList(), 0);

            return Ok(res2);
        }

        
    }
}
