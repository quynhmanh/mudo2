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
using Svg;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Serilog;

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

            [JsonProperty(PropertyName = "duration")]
            public float duration;
            
        }

        [HttpPost("[action]")]
        [RequestSizeLimit(200000000)]
        public async System.Threading.Tasks.Task<IActionResult> AddVideo()
        {
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddMediaRequest oDownloadBody = JsonConvert.DeserializeObject<AddMediaRequest>(body);
                var dataFont = oDownloadBody.data;
                var id = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");

                string file2 = "videos" + Path.DirectorySeparatorChar + id + "." + oDownloadBody.ext;
                string file3 = "videos" + Path.DirectorySeparatorChar + id + "_thumbnail." + oDownloadBody.ext;
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
                mediaModel.Duration = oDownloadBody.duration;

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

                }
                catch (Exception e)
                {
                    mediaModel.RepresentativeThumbnail = file2;
                }

                MediaService.Add(mediaModel);
            }

            return Ok();

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
                string file3 = "images" + Path.DirectorySeparatorChar + id + "_thumbnail." + "png";
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
                    if (oDownloadBody.ext == "svg")
                    {
                        // Create PNG Image from SVG-File
                        var svgDocument = Svg.SvgDocument.Open(filePath);  // Replace with correct FileName
                        svgDocument.ShapeRendering = SvgShapeRendering.Auto;

                        Bitmap bmp = svgDocument.Draw(200, 200);                          // Draw Bitmap in any Size you need - for example 12px x 12px
                        bmp.Save(filePath3, ImageFormat.Png); 				// save Bitmap as PNG-File
                        mediaModel.RepresentativeThumbnail = file3;
                    }
                    else
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
                    }

                } catch (Exception e)
                {
                    Log.Logger.Error($"Something went wrong: {e}");
                    mediaModel.RepresentativeThumbnail = file2;
                }

                MediaService.Add(mediaModel);

                return Ok(mediaModel);
            }

            return Ok();
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Add2()
        {
            string svgTemplate = @"<svg 
            className='unblurred' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.1' id='svgElement' x='0px' y='0px' width='600px' height='400px' viewBox='0 0 600 400' enable-background='new 0 0 600 400' xmlSpace='preserve'>
            <defs>
              <mask id='myCircle'>
                 <image style='width:500px;'
            href='data:image/jpeg;base64,[IMAGE1]' />
         </mask>

     </defs>

     <image className = 'unblurred' mask='url(#myCircle)' style='width:500px;' href='data:image/jpeg;base64,[IMAGE2]'/>
</svg>";
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                AddMediaRequest oDownloadBody = JsonConvert.DeserializeObject<AddMediaRequest>(body);
                var dataFont = oDownloadBody.data;
                var id = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");

                string file2 = "images" + Path.DirectorySeparatorChar + id + "." + oDownloadBody.ext;
                string file3 = "images" + Path.DirectorySeparatorChar + id + "_thumbnail." + oDownloadBody.ext;
                string file4 = "images" + Path.DirectorySeparatorChar + id + "_removebackground." + "png";
                string file5 = "images" + Path.DirectorySeparatorChar + id + "_removebackgroundSVG." + "svg";

                var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2);
                var filePath3 = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file3);
                string base64 = dataFont.Substring(dataFont.IndexOf(',') + 1);
                svgTemplate = svgTemplate.Replace("[IMAGE2]", base64);
                byte[] data = Convert.FromBase64String(base64);
                System.Drawing.Image img;
                using (var fontFile = new FileStream(filePath, FileMode.Create))
                {
                    fontFile.Write(data, 0, data.Length);
                    fontFile.Flush();
                }


                MediaModel mediaModel = new MediaModel();
                mediaModel.Id = id.ToString();
                mediaModel.Representative = file5;
                mediaModel.RepresentativeRemoveBackground = file4;
                mediaModel.Width = oDownloadBody.width;
                mediaModel.height = oDownloadBody.height;
                mediaModel.Type = oDownloadBody.type;
                mediaModel.Keywords = oDownloadBody.keywords;
                mediaModel.FirstName = oDownloadBody.title;
                mediaModel.Color = oDownloadBody.color;
                mediaModel.UserEmail = oDownloadBody.userEmail;
                mediaModel.Ext = oDownloadBody.ext;
                mediaModel.RepresentativeRemoveBackgroundSVG = file5;
                mediaModel.RepresentativeThumbnail = file5;


                ProcessStartInfo start = new ProcessStartInfo();
                start.FileName = "/usr/local/bin/python3";
                start.Arguments = string.Format($"seg.py wwwroot/{file2} wwwroot/{file4} 1");
                start.UseShellExecute = false;// Do not use OS shell
                start.CreateNoWindow = true; // We don't need new window
                start.RedirectStandardOutput = true;// Any output, generated by application will be redirected back
                start.RedirectStandardError = true; // Any error in standard output will be redirected back (for example exceptions)
                using (Process process = Process.Start(start))
                {
                    using (StreamReader reader2 = process.StandardOutput)
                    {
                        string stderr = process.StandardError.ReadToEnd(); // Here are the exceptions from our Python script
                        string result = reader2.ReadToEnd(); // Here is the result of StdOut(for example: print "test")
                    }
                }

                var filePath4 = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file4);
                using (Image image = Image.FromFile(filePath4))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();

                        // Convert byte[] to Base64 String
                        string base64String = Convert.ToBase64String(imageBytes);
                        svgTemplate = svgTemplate.Replace("[IMAGE1]", base64String);
                    }
                }

                byte[] bytes = Encoding.ASCII.GetBytes(svgTemplate);

                var filePath5 = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file5);
                using (var fontFile = new FileStream(filePath5, FileMode.Create))
                {
                    fontFile.Write(bytes);
                    fontFile.Flush();
                }

                //try
                //{

                //    img = System.Drawing.Image.FromFile(filePath);

                //    double imgHeight = img.Size.Height;
                //    double imgWidth = img.Size.Width;

                //    double x = imgWidth / 300;
                //    int newWidth = Convert.ToInt32(imgWidth / x);
                //    int newHeight = Convert.ToInt32(imgHeight / x);

                //    //----------        Creating Small Image
                //    System.Drawing.Image myThumbnail = img.GetThumbnailImage(newWidth, newHeight, null, IntPtr.Zero);
                //    myThumbnail.Save(filePath3);
                //    mediaModel.RepresentativeThumbnail = file3;

                //}
                //catch (Exception e)
                //{
                //    mediaModel.RepresentativeThumbnail = mediaModel.Representative;
                //}

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
