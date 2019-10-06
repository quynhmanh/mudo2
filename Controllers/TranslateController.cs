using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("locales/{language}/{namespace}")]
    public class TranslateController : ControllerBase
    {
        private static readonly string AppRoot = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

        [HttpGet]
        public IActionResult Get()
        {
            string language = getParam("language");
            string ns = getParam("namespace");
            if (language == null || ns == null) 
            {
                return BadRequest();
            }

            string path = AppRoot + "/../../../locales/" + language + "/" + ns;

            if (!System.IO.File.Exists(path))
            {
                return BadRequest();
            }

            string jsonResult;
  
            using (StreamReader streamReader = new StreamReader(path))
            {
                jsonResult = streamReader.ReadToEnd();
            }
            
            JObject data = JObject.Parse(jsonResult);
            return Json(data);
        }

        private string getParam(string key) {
            Object tmp = RouteData.Values[key];
            if (tmp != null && !string.IsNullOrWhiteSpace(tmp.ToString())) {
                return tmp.ToString();
            }
            return null;
        }
    }
}
