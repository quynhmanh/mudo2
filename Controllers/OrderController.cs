using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;
using System.Linq;
using System.Threading.Tasks;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {

        //private readonly DbContextOptions<PersonContext> _context;
        private OrderService OrderService { get; }
        private IHostingEnvironment HostingEnvironment { get; set; }

        public OrderController(OrderService orderService, HostingEnvironment hostingEnvironment)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            OrderService = orderService;
            HostingEnvironment = hostingEnvironment;
        }

        
        [HttpPost("[action]")]
        public IActionResult Add(OrderModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");

            var result = OrderService.Add(model);
            return Json(result);
        }

        [HttpGet("[action]")]
        public IActionResult Search()
        {
            return Json(OrderService.Search());
        }

    }
}
