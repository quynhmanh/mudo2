using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using PuppeteerSharp;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private MediaService MediaService { get; }
        private IHostingEnvironment HostingEnvironment { get; set; }

        public MediaController(MediaService mediaService, IHostingEnvironment hostingEnvironment)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            MediaService = mediaService;
            HostingEnvironment = hostingEnvironment;
        }

        class AddMediaRequest
        {
            [JsonProperty(PropertyName = "id")]
            public string id;

            [JsonProperty(PropertyName = "title")]
            public string title;

            [JsonProperty(PropertyName = "data")]
            public string data;

            [JsonProperty(PropertyName = "width")]
            public float width;

            [JsonProperty(PropertyName = "height")]
            public float height;

            [JsonProperty(PropertyName = "type")]
            public int type;

            [JsonProperty(PropertyName = "keywords")]
            public string[] keywords;

            [JsonProperty(PropertyName = "color")]
            public string color;

            [JsonProperty(PropertyName = "userEmail")]
            public string userEmail;

            [JsonProperty(PropertyName = "ext")]
            public string ext;
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Add()
        {
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddMediaRequest oDownloadBody = JsonConvert.DeserializeObject<AddMediaRequest>(body);
                var dataFont = oDownloadBody.data;
                var id = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");

                string file2 = "images" + Path.DirectorySeparatorChar + id + "." + oDownloadBody.ext;
                string file3 = "images" + Path.DirectorySeparatorChar + id + "_thumbnail." + oDownloadBody.ext;
                var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2);
                var filePath3 = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file3);
                string base64 = dataFont.Substring(dataFont.IndexOf(',') + 1);
                byte[] data = Convert.FromBase64String(base64);
                System.Drawing.Image img;
                using (var fontFile = new FileStream(filePath, FileMode.Create))
                {
                    fontFile.Write(data, 0, data.Length);
                    fontFile.Flush();
                }


                MediaModel mediaModel = new MediaModel();
                mediaModel.Id = id.ToString();
                mediaModel.Representative = file2;
                mediaModel.Width = oDownloadBody.width;
                mediaModel.height = oDownloadBody.height;
                mediaModel.Type = oDownloadBody.type;
                mediaModel.Keywords = oDownloadBody.keywords;
                mediaModel.FirstName = oDownloadBody.title;
                mediaModel.Color = oDownloadBody.color;
                mediaModel.UserEmail = oDownloadBody.userEmail;
                mediaModel.Ext = oDownloadBody.ext;

                try
                {

                    img = System.Drawing.Image.FromFile(filePath);

                    double imgHeight = img.Size.Height;
                    double imgWidth = img.Size.Width;

                    double x = imgWidth / 300;
                    int newWidth = Convert.ToInt32(imgWidth / x);
                    int newHeight = Convert.ToInt32(imgHeight / x);

                    //----------        Creating Small Image
                    System.Drawing.Image myThumbnail = img.GetThumbnailImage(newWidth, newHeight, null, IntPtr.Zero);
                    myThumbnail.Save(filePath3);
                    mediaModel.RepresentativeThumbnail = file3;

                } catch (Exception e)
                {
                    mediaModel.RepresentativeThumbnail = file2;
                }

                MediaService.Add(mediaModel);
            }

            return Ok();

        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]int type = 0, [FromQuery]int page = 1, [FromQuery]int perPage = 1, [FromQuery]string terms = "", [FromQuery]string userEmail = "")
        {
            return Json(MediaService.Search(type, page, perPage, terms, userEmail));
        }

        [HttpGet("[action]")]
        public IActionResult RemoveAll()
        {
            return Json(MediaService.RemoveAll());
        }

        [HttpDelete("[action]")]
        public IActionResult Delete([FromQuery]string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest($"{nameof(id)} is not filled.");
            var result = MediaService.Delete(id);
            return Json(result);
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Edit()
        {
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddMediaRequest oDownloadBody = JsonConvert.DeserializeObject<AddMediaRequest>(body);

                MediaModel mediaModel = new MediaModel();
                mediaModel.Id = oDownloadBody.id;
                mediaModel.Width = oDownloadBody.width;
                mediaModel.height = oDownloadBody.height;
                mediaModel.Type = oDownloadBody.type;
                mediaModel.Keywords = oDownloadBody.keywords;
                mediaModel.FirstName = oDownloadBody.title;

                MediaService.Edit(mediaModel);
            }

            return Ok();

        }
    }
}
