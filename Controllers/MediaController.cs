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
using System.Drawing.Drawing2D;

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

            [JsonProperty(PropertyName = "path")]
            public string path;

            [JsonProperty(PropertyName = "userEmail")]
            public string userEmail;

            [JsonProperty(PropertyName = "ext")]
            public string ext;

            [JsonProperty(PropertyName = "duration")]
            public float duration;

            [JsonProperty(PropertyName = "clipId")]
            public string clipId;

            [JsonProperty(PropertyName = "clipWidth0")]
            public float clipWidth0 { get; set; }

            [JsonProperty(PropertyName = "clipHeight0")]
            public float clipHeight0 { get; set; }

            [JsonProperty(PropertyName = "clipWidth")]
            public float clipWidth { get; set; }

            [JsonProperty(PropertyName = "clipHeight")]
            public float clipHeight { get; set; }

            [JsonProperty(PropertyName = "path2")]
            public string path2 { get; set; }

            [JsonProperty(PropertyName = "popularity")]
            public long popularity { get; set; }

            [JsonProperty(PropertyName = "popularity2")]
            public long popularity2 { get; set; }

            [JsonProperty(PropertyName = "x1")]
            public string x1 { get; set; }

            [JsonProperty(PropertyName = "y1")]
            public string y1 { get; set; }

            [JsonProperty(PropertyName = "x2")]
            public string x2 { get; set; }

            [JsonProperty(PropertyName = "y2")]
            public string y2 { get; set; }

            [JsonProperty(PropertyName = "stopColor")]
            public string[] stopColor { get; set; }

            [JsonProperty(PropertyName = "stopColor1")]
            public string stopColor1 { get; set; }
            
            [JsonProperty(PropertyName = "stopColor2")]
            public string stopColor2 { get; set; }

            [JsonProperty(PropertyName = "stopColor3")]
            public string stopColor3 { get; set; }
            
            [JsonProperty(PropertyName = "stopColor4")]
            public string stopColor4 { get; set; }
        }

        [HttpPost("[action]")]
        [RequestSizeLimit(200000000)]
        public IActionResult AddVideo()
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
                    var exePath = "/usr/bin/ffmpeg";
                    if (HostingEnvironment.IsDevelopment())
                    {
                        exePath = "F:\\ffmpeg-20200716-d11cc74-win64-static\\bin\\ffmpeg.exe";
                    }

                    var process = new Process
                    {
                        StartInfo =
                        {
                            FileName = exePath,
                            Arguments = $"-i {filePath} -vcodec libx264 -crf 45 {filePath3}",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardInput = true
                        }
                    };

                    process.Start();
                    process.WaitForExit();
                    process.Close();
                    
                    mediaModel.RepresentativeThumbnail = file3;

                }
                catch (Exception e)
                {
                    Log.Logger.Error($"Something went wrong: {e}");
                    mediaModel.RepresentativeThumbnail = file2;
                }

                MediaService.Add(mediaModel);
            }

            return Ok();

        }

        private ImageCodecInfo GetEncoder(ImageFormat format)  
        {  
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();  
            foreach (ImageCodecInfo codec in codecs)  
            {  
                if (codec.FormatID == format.Guid)  
                {  
                    return codec;  
                }  
            }  
            return null;  
        }  

        [HttpPost("[action]")]
        public IActionResult Add()
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
                mediaModel.Path = oDownloadBody.path;
                mediaModel.StopColor = oDownloadBody.stopColor;
                
                try
                {
                    if (oDownloadBody.ext == "svg")
                    {
                        // Create PNG Image from SVG-File
                        var svgDocument = SvgDocument.Open<SvgDocument>(filePath, null);

                        var svgHeight = 0;
                        var svgWidth = 0;
                        double ratio = (double)oDownloadBody.width / (double)oDownloadBody.height;
                        if (oDownloadBody.height > oDownloadBody.width) {
                            svgHeight = 320;
                            svgWidth = (int)(320 * ratio);
                        } else {
                            svgWidth = 320;
                            svgHeight = (int)(320 / ratio);
                        }
                        svgDocument.Width = new SvgUnit(SvgUnitType.Pixel, svgWidth);
                        svgDocument.Height = new SvgUnit(SvgUnitType.Pixel, svgHeight);
                        Bitmap bmp = svgDocument.Draw();
                        bmp.Save(filePath3, ImageFormat.Png); 				// save Bitmap as PNG-File
                        mediaModel.RepresentativeThumbnail = file3;
                    }
                    if (oDownloadBody.ext == "gif")
                    {
                        mediaModel.RepresentativeThumbnail = file2;
                    } else {
                        img = System.Drawing.Image.FromFile(filePath);

                        double imgHeight = img.Size.Height;
                        double imgWidth = img.Size.Width;

                        double x = imgWidth / 300;
                        int newWidth = Convert.ToInt32(imgWidth / x);
                        int newHeight = Convert.ToInt32(imgHeight / x);

                        ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);  

                        // Create an Encoder object based on the GUID  
                        // for the Quality parameter category.  
                        System.Drawing.Imaging.Encoder myEncoder =  
                            System.Drawing.Imaging.Encoder.Quality;  
            
                        // Create an EncoderParameters object.  
                        // An EncoderParameters object has an array of EncoderParameter  
                        // objects. In this case, there is only one  
                        // EncoderParameter object in the array.  
                        EncoderParameters myEncoderParameters = new EncoderParameters(1);  
            
                        EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 50L);  
                        myEncoderParameters.Param[0] = myEncoderParameter;  

                        var img2 = (Image)(new Bitmap(img, new Size(newWidth,newHeight)));
                        img2.Save(filePath3, jpgEncoder, myEncoderParameters);

                        // img.Save(filePath3, ImageFormat.Jpeg, 
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
        }

        [HttpPost("[action]")]
        public IActionResult Add2()
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
        public IActionResult InitSearch([FromQuery]int type = 0, [FromQuery]int page = 1, [FromQuery]int perPage = 1, [FromQuery]string terms = "", [FromQuery]string userEmail = "")
        {
            return Json(MediaService.InitSearch(type, page, perPage, terms, userEmail));
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
        public IActionResult Edit()
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
                mediaModel.ClipId = oDownloadBody.clipId;
                mediaModel.ClipWidth = oDownloadBody.clipWidth;
                mediaModel.ClipHeight = oDownloadBody.clipHeight;
                mediaModel.ClipWidth0 = oDownloadBody.clipWidth0;
                mediaModel.ClipHeight0 = oDownloadBody.clipHeight0;
                mediaModel.Path = oDownloadBody.path;
                mediaModel.Path2 = oDownloadBody.path2;
                mediaModel.Popularity = oDownloadBody.popularity;
                mediaModel.Popularity2 = oDownloadBody.popularity2;
                mediaModel.StopColor1 = oDownloadBody.stopColor1;
                mediaModel.StopColor2 = oDownloadBody.stopColor2;
                mediaModel.StopColor3 = oDownloadBody.stopColor3;
                mediaModel.StopColor4 = oDownloadBody.stopColor4;

                MediaService.Edit(mediaModel);
            }

            return Ok();

        }
    }
}
