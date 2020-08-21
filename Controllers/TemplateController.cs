using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;
using Microsoft.Extensions.Configuration;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private TemplateService TemplateService { get; }
        private IHostingEnvironment HostingEnvironment { get; set; }
        private IConfiguration Configuration { get; set; }


        public TemplateController(TemplateService templateService, IHostingEnvironment hostingEnvironment, IConfiguration configuration)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            TemplateService = templateService;
            HostingEnvironment = hostingEnvironment;
            Configuration = configuration;
        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string type = null, [FromQuery]int page = 1, [FromQuery]int perPage = 1, [FromQuery]string printType = "")
        {
            return Json(TemplateService.Search(type, page, perPage, printType: printType));
        }

        [HttpGet("[action]")]
        public IActionResult SearchWithUserName([FromQuery]string userName = null)
        {
            return Json(TemplateService.SearchWithUserName(userName));
        }

        [HttpGet("[action]")]
        public IActionResult SearchAngAggregate([FromQuery]string type = null, [FromQuery]int page = 1, [FromQuery]int perPage = 5, [FromQuery]string filePath = "", [FromQuery]string subType = "")
        {
            return Json(TemplateService.SearchAngAggregate(type, page, perPage, filePath, subType));
        }

        private class DownloadBody
        {
            [JsonProperty(PropertyName = "fonts")]
            public string[] Fonts;
            [JsonProperty(PropertyName = "canvas")]
            public string[] Canvas;
            [JsonProperty(PropertyName = "additionalStyle")]
            public string AdditionalStyle;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Add(TemplateModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");

            TemplateService designService = new TemplateService(null, HostingEnvironment, Configuration);

            bool omitBackground = model.Type == "2" ? true : false;
            await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, true, model.Type == "2", model.Representative, omitBackground);

            // int width = 656;
            // int height = 436;
            // //if (model.PrintType > 3)
            // //{
            // width = (int)model.Width;
            // height = (int)model.Height;
            // //}

            // await designService.GenerateRepresentative(model, width, height, true, model.Type == "2", model.Representative2);

            // if (model.IsVideo)
            // {
            //     string body = null;
            //     using (var reader = new StreamReader(Request.Body))
            //     {
            //         body = reader.ReadToEnd();
            //     }

            //     var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + model.VideoRepresentative);
            //     byte[] res = await designService.DownloadVideo(width.ToString(), height.ToString(), model.Id, model);
            //     using (var imageFile = new FileStream(filePath, FileMode.Create))
            //     {
            //         imageFile.Write(res, 0, res.Length);
            //         imageFile.Flush();
            //     }
            // }

            var result = TemplateService.Add(model);

            return Json(Ok());
        }

        [HttpGet("[action]")]
        public IActionResult Get([FromQuery]string id)
        {
            return Json(TemplateService.Get(id));
        }

        [HttpPost("[action]")]
        [RequestSizeLimit(2147483648)] // e.g. 2 GB request limit
        public async Task<IActionResult> Update(TemplateModel model)
        {

            if (System.IO.File.Exists(model.Representative))
            {
                System.IO.File.Delete(model.Representative);
            }

            if (System.IO.File.Exists(model.Representative2))
            {
                System.IO.File.Delete(model.Representative2);
            }

            if (System.IO.File.Exists(model.VideoRepresentative))
            {
                System.IO.File.Delete(model.VideoRepresentative);
            }

            TemplateService designService = new TemplateService(null, HostingEnvironment, Configuration);

            bool omitBackground = model.Type == "2" ? true : false;
            await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, true, model.Type == "2", model.Representative, omitBackground);

            var result = TemplateService.Update(model);
            return Json(Ok());
        }

        [HttpDelete("[action]")]
        public IActionResult Delete([FromQuery]string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest($"{nameof(id)} is not filled.");
            var result = TemplateService.Delete(id);
            return Json(result);
        }

        [HttpPost("[action]")]
        public IActionResult Upload([FromQuery]string id)
        {
            String imageContent = this.HttpContext.Request.Form["file"];

            string file2 = "images" + Path.DirectorySeparatorChar + Guid.NewGuid() + ".png";
            var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2);
            string base64 = imageContent.Substring(imageContent.IndexOf(',') + 1);
            byte[] data = Convert.FromBase64String(base64);
            using (var imageFile = new FileStream(filePath, FileMode.Create))
            {
                imageFile.Write(data, 0, data.Length);
                imageFile.Flush();
            }

            var result = TemplateService.UpdateRepresentative(id, "/" + file2);

            return Json(result);
        }

        [HttpGet("[action]")]
        public IActionResult RemoveAll()
        {
            return Json(TemplateService.RemoveAll());
        }

        class AddMediaRequest
        {
            [JsonProperty(PropertyName = "id")]
            public string id;

            [JsonProperty(PropertyName = "title")]
            public string title;

            [JsonProperty(PropertyName = "keywords")]
            public string[] keywords;

            [JsonProperty(PropertyName = "filePath")]
            public string filePath;

            [JsonProperty(PropertyName = "subType")]
            public string subType;
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Edit()
        {
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddMediaRequest oDownloadBody = JsonConvert.DeserializeObject<AddMediaRequest>(body);

                TemplateModel mediaModel = new TemplateModel();
                mediaModel.Id = oDownloadBody.id;
                mediaModel.Keywords = oDownloadBody.keywords;
                mediaModel.FirstName = oDownloadBody.title;
                mediaModel.FilePath = oDownloadBody.filePath;
                mediaModel.SubType = oDownloadBody.subType;

                TemplateService.Edit(mediaModel);
            }

            return Ok();

        }
    }
}
