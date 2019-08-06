using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private TemplateService TemplateService { get; }
        private IHostingEnvironment HostingEnvironment { get; set; }

        public TemplateController(TemplateService templateService, IHostingEnvironment hostingEnvironment)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            TemplateService = templateService;
            HostingEnvironment = hostingEnvironment;
        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string type = null, [FromQuery]int page = 1, [FromQuery]int perPage = 1)
        {
            return Json(TemplateService.Search(type, page, perPage));
        }

        [HttpPost("[action]")]
        public IActionResult Add(TemplateModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");
            var result = TemplateService.Add(model);
            return Json(result);
        }

        [HttpGet("[action]")]
        public IActionResult Get([FromQuery]string id)
        {
            return Json(TemplateService.Get(id));
        }

        [HttpPost("[action]")]
        [RequestSizeLimit(2147483648)] // e.g. 2 GB request limit
        public IActionResult Update(TemplateModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");
            var result = TemplateService.Update(model);
            return Json(result);
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
    }
}
