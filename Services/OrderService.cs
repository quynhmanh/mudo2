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
    public class OrderService : ServiceBase
    {
        public virtual Result<int> Add(OrderModel model)
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index("order")); 

            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<OrderModel>, long>> Search()
        {
            var node = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(node).DefaultIndex("order").DisableDirectStreaming();
            var client = new ElasticClient(settings);

            string query = $"*:*";

            var res = client.Search<OrderModel>(s => s.Query(q => q.QueryString(d => d.Query(query))));

            var res2 = new KeyValuePair<List<OrderModel>, long>(res.Documents.ToList(), res.Total);

            return Ok(res2);
        }
    }
}