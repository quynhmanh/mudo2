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
    public class FontController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private FontService FontService { get; }
        private IHostingEnvironment HostingEnvironment { get; set; }

        public FontController(FontService fontService, IHostingEnvironment hostingEnvironment)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            FontService = fontService;
            HostingEnvironment = hostingEnvironment;
        }

        class AddFontRequest
        {
            [JsonProperty(PropertyName = "id")]
            public string id;

            [JsonProperty(PropertyName = "data")]
            public string data;
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Add()
        {
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddFontRequest oDownloadBody = JsonConvert.DeserializeObject<AddFontRequest>(body);
                var dataFont = oDownloadBody.data;
                var id = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");

                string file2 = "fonts" + Path.DirectorySeparatorChar + id + ".ttf";
                var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2);
                string base64 = dataFont.Substring(dataFont.IndexOf(',') + 1);
                byte[] data = Convert.FromBase64String(base64);
                using (var fontFile = new FileStream(filePath, FileMode.Create))
                {
                    fontFile.Write(data, 0, data.Length);
                    fontFile.Flush();
                }

                FontModel fontModel = new FontModel();
                fontModel.Id = id.ToString();

                string style = $"@font-face {{ font-family: '{id}'; src: url(data:font/ttf;base64,{base64} ); }}";

                var template = $"<html><head><style type='text/css'>[FONT_FACE] body {{ margin: 0; }}</style></head><body><span style=\"display: block; width: 250px; text-align: center; color: white; line-height: 25px; font-size: 21px; font-family: '{id}';\" >Xin chào!</span></body></html>";

                template = template.Replace("[FONT_FACE]", style);

                //byte[] bytes = Encoding.ASCII.GetBytes(template);
                //using (var htmlFile = new FileStream("/Users/llaugusty/Downloads/quynh.html", FileMode.Create))
                //{
                //    htmlFile.Write(bytes, 0, bytes.Length);
                //    htmlFile.Flush();
                //}

                await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    DefaultViewport = new ViewPortOptions()
                    {
                        Width = 250,
                        Height = 50,
                    },
                    Args = new string[] { "--no-sandbox", "--disable-setuid-sandbox" },
                });
                var page = await browser.NewPageAsync();
                await page.SetContentAsync(template);
                await page.SetViewportAsync(new ViewPortOptions()
                {
                    DeviceScaleFactor = 2.0,
                });
                byte[] a = await page.ScreenshotDataAsync(new ScreenshotOptions()
                {   OmitBackground = true,
                    Clip = new PuppeteerSharp.Media.Clip()
                    {
                        X = 0,
                        Y = 0,
                        Width = 250,
                        Height = 25,
                    },
                });
                string file2Rep = "images" + Path.DirectorySeparatorChar + Guid.NewGuid() + ".png";
                var filePathRep = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2Rep);

                using (var imageFile = new FileStream(filePathRep, FileMode.Create))
                {
                    imageFile.Write(a, 0, a.Length);
                    imageFile.Flush();
                }

                fontModel.Representative = file2Rep;

                FontService.Add(fontModel);

                await browser.CloseAsync();
            }

            return Ok();

        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string term = null, [FromQuery]int page = 1, [FromQuery]int perPage = 1)
        {
            return Json(FontService.Search(term, page, perPage));
        }

        [HttpDelete("[action]")]
        public IActionResult Delete([FromQuery]string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest($"{nameof(id)} is not filled.");
            var result = FontService.Delete(id);
            return Json(result);
        }
    }
}
