using Microsoft.AspNetCore.Mvc;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TextTemplateController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private TemplateService TemplateService { get; }

        public TextTemplateController(TemplateService templateService)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            TemplateService = templateService;
        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string term = null)
        {
            return null;
        }

        [HttpPost("[action]")]
        public IActionResult Add(TemplateModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");
            var result = TemplateService.Add(model);
            return Json(result);
        }

        //[HttpPatch("{id:int}")]
        //public IActionResult Update(PersonModel model)
        //{
        //    if (model == null)
        //        return BadRequest($"{nameof(model)} is null.");
        //    var result = PersonService.Update(model);
        //    return Json(result);
        //}

        //[HttpDelete("{id:int}")]
        //public IActionResult Delete(int id)
        //{
        //    if (id <= 0)
        //        return BadRequest($"{nameof(id)} <= 0.");
        //    var result = PersonService.Delete(id);
        //    return Json(result);
        //}
    }
}
