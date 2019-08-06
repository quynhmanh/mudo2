using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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
            _fontContext.Fonts.Add(model);
            _fontContext.SaveChanges();


            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<FontModel>, int>> Search(string term = null, int page = 1, int perPage = 20)
        {
            List<FontModel> fonts = _fontContext.Fonts.ToList();
            var result = new KeyValuePair<List<FontModel>, int>(fonts.Skip((page - 1) * perPage).Take(perPage).ToList(), fonts.Count);
            return Ok(result);
        }
    }
}
