using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PuppeteerSharp;
using RCB.TypeScript.Models;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesignController : ControllerBase
    {
        
        //private readonly DbContextOptions<PersonContext> _context;
        private DesignService DesignService { get; }
        private TemplateService TemplateService { get; }

        private IHostingEnvironment HostingEnvironment { get; set; }
        private IConfiguration Configuration { get; set; }

        public DesignController(DesignService designService, TemplateService templateService, IHostingEnvironment hostingEnvironment, IConfiguration configuration)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            DesignService = designService;
            HostingEnvironment = hostingEnvironment;
            Configuration = configuration;
            TemplateService = templateService;
        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string type = null)
        {
            return Json(DesignService.Search(type));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Add(DesignModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");

            TemplateService designService = new TemplateService(null, HostingEnvironment, Configuration);

            await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, true, false, model.Representative);
            // model.Representative = res;

            var result = DesignService.Add(model);
            return Json(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddOrUpdate(DesignModel model)
        {
            if (model == null)
                return BadRequest($"{nameof(model)} is null.");

            TemplateService designService = new TemplateService(null, HostingEnvironment, Configuration);

            await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, true, false, model.Representative);
            // model.Representative = res;
            var result = DesignService.Get(model.Id);
            if (result.HasErrors) {
                await DesignService.Add(model);
            } else {
                DesignService.Update(model);
            }
            return Json(result);
        }

        [HttpPost("[action]")]
        [RequestSizeLimit(2147483648)] // e.g. 2 GB request limit
        public async Task<IActionResult> Update(DesignModel model)
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

            await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, true, model.Type == "2", model.Representative);

            var result = DesignService.Update(model);
            return Json(Ok());
        }

        [HttpGet("[action]")]
        public IActionResult SearchWithUserName([FromQuery]string userName = null, [FromQuery]int page = 1, [FromQuery]int perPage = 5)
        {
            return Json(DesignService.SearchWithUserName(userName, page, perPage));
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
        public async System.Threading.Tasks.Task<IActionResult> DownloadPNG([FromQuery]string width, [FromQuery]string height, [FromQuery]bool download, [FromQuery]bool transparent, [FromQuery]bool png)
        {
            string resPath = null;
            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                DownloadBody oDownloadBody = JsonConvert.DeserializeObject<DownloadBody>(body);

                string style = AppSettings.style;
                try
                {
                    for (int i = 0; i < oDownloadBody.Fonts.Length; ++i)
                    {
                        try {
                            byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{oDownloadBody.Fonts[i]}.ttf");
                            String file = Convert.ToBase64String(AsBytes);

                            string s = $"@font-face {{ font-family: '{oDownloadBody.Fonts[i]}'; src: url(data:font/ttf;base64,{file} ); }}";
                            style += s;
                        } catch (Exception e) {
                            
                        }
                    }
                } catch (Exception e)
                {

                }

                string template =
                    AppSettings.templateDownload
                        .Replace("[ADDITIONAL_STYLE]", ".alo2 { background-color: transparent !important; } ")
                        .Replace("[FONT_FACE]", style)
                        .Replace("[RECT_WIDTH]", width)
                        .Replace("[RECT_HEIGHT]", height);

                if (HostingEnvironment.IsProduction()) {
                    template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
                }

                template = template.Replace("[FONT_FACE]", style);
                byte[] data = null;
                using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
                {
                    iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                    iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                    doc.Open();
                    var canvas = oDownloadBody.Canvas;
                    for (var i = 0; i < canvas.Length; ++i)
                    {
                        var html = template.Replace("[CANVAS]", canvas[i]);
                        try
                        {
                            byte[] bytes = Encoding.ASCII.GetBytes(html);
                            using (var htmlFile = new FileStream("/Users/quynhnguyen/Downloads/quynh2.html", FileMode.Create))
                            {
                                htmlFile.Write(bytes, 0, bytes.Length);
                                htmlFile.Flush();
                            }
                        }
                        catch (Exception e)
                        {

                        }

                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            DefaultViewport = new ViewPortOptions()
                            {
                                Width = (int)double.Parse(width),
                                Height = (int)double.Parse(height),
                            },
                            Args = new string[] { "--no-sandbox", "--disable-setuid-sandbox" },
                            IgnoreHTTPSErrors = true,
                        }))
                        {

                            var page = await browser.NewPageAsync();

                            await page.SetContentAsync(html);

                            Stream a;
                            if (png)
                            {
                                a = await page.ScreenshotStreamAsync(new ScreenshotOptions()
                                {
                                    Clip = new PuppeteerSharp.Media.Clip()
                                    {
                                        Width = decimal.Parse(width),
                                        Height = decimal.Parse(height),
                                    },
                                    BurstMode = true,
                                    OmitBackground = transparent,
                                    Type = ScreenshotType.Png,
                                });
                            }
                            else
                            {
                                a = await page.ScreenshotStreamAsync(new ScreenshotOptions()
                                {
                                    Clip = new PuppeteerSharp.Media.Clip()
                                    {
                                        Width = decimal.Parse(width),
                                        Height = decimal.Parse(height),
                                    },
                                    BurstMode = true,
                                    OmitBackground = transparent,
                                    Type = ScreenshotType.Jpeg,
                                    Quality = 100,
                                });
                            }

                            using (var memoryStream = new MemoryStream())
                            {
                                a.CopyTo(memoryStream);
                                data = memoryStream.ToArray();
                            }

                            resPath = "images" + Path.DirectorySeparatorChar + Guid.NewGuid() + ".png";
                            var filePathRep = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + resPath);

                            using (var imageFile = new FileStream(filePathRep, FileMode.Create))
                            {
                                imageFile.Write(data, 0, data.Length);
                                imageFile.Flush();
                            }
                        }
                    }

                    //doc.Close();
                    //pCopy.Close();
                    //data = msOutput.ToArray();
                }

                //p.WaitForExit();

                if (download)
                {
                    return File(data, "image/png");
                } else
                {
                    return Content(resPath);
                }

                //return Json(null);
            }
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> VideoStream([FromQuery]string videoId)
        {

            var filePath = "/app/wwwroot/" + videoId + ".webm";
            if (HostingEnvironment.IsDevelopment())
            {
                filePath = "./wwwroot/" + videoId + ".webm";
            }

            using (var fontFile = new FileStream(filePath, FileMode.Append))
            {
                var file = Request.Form.Files.GetFile("webm");
                file.CopyTo(fontFile);
            }

            return Json("");
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> Download([FromQuery]string width, [FromQuery]string height)
        {

            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                DownloadBody oDownloadBody = JsonConvert.DeserializeObject<DownloadBody>(body);

                string style = AppSettings.style;
                for (int i = 0; i < oDownloadBody.Fonts.Length; ++i)
                {
                    try
                    {
                        byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{oDownloadBody.Fonts[i]}.ttf");
                        String file = Convert.ToBase64String(AsBytes);

                        string s = $"@font-face {{ font-family: '{oDownloadBody.Fonts[i]}'; src: url('https://localhost:64099/fonts/{oDownloadBody.Fonts[i]}.ttf'); }}";
                        style += s;
                    }
                    catch (Exception e)
                    {

                    }
                }

                string template =
                    AppSettings.templateDownload
                        .Replace("[FONT_FACE]", style)
                        .Replace("[RECT_WIDTH]", width)
                        .Replace("[RECT_HEIGHT]", height);

                if (HostingEnvironment.IsProduction()) {
                    template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
                }

                byte[] data = null;
                using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
                {
                    iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                    iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                    doc.Open();
                    var canvas = oDownloadBody.Canvas;
                    for (var i = 0; i < canvas.Length; ++i)
                    {
                        var html = template.Replace("[CANVAS]", canvas[i]);
                        try
                        {
                            byte[] bytes = Encoding.ASCII.GetBytes(html);
                            using (var htmlFile = new FileStream("/Users/quynhnguyen/Downloads/quynh2.html", FileMode.Create))
                            {
                                htmlFile.Write(bytes, 0, bytes.Length);
                                htmlFile.Flush();
                            }
                        } catch (Exception e)
                        {

                        }

                        var executablePath = "/usr/bin/google-chrome-stable";
                        if (HostingEnvironment.IsDevelopment())
                        {
                            executablePath = Configuration.GetSection("chromeExePath").Get<string>();
                        }

                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            DefaultViewport = new ViewPortOptions()
                            {
                                Width = (int)double.Parse(width),
                                Height = (int)double.Parse(height),
                            },
                            Args = new string[] { "--no-sandbox", "--disable-setuid-sandbox" },
                            ExecutablePath = executablePath,
                            //Headless = false,
                            IgnoreHTTPSErrors = true,
                        }))
                        {
                            var page = await browser.NewPageAsync();
                            await page.SetContentAsync(html, new NavigationOptions() {
                                WaitUntil = new WaitUntilNavigation[] {WaitUntilNavigation.Load}
                            });
                            Stream a = await page.PdfStreamAsync(new PdfOptions()
                            {
                                Width = width + "px",
                                Height = (int)double.Parse(height) + 5000 + "px",
                            });

                            string b = await page.ScreenshotBase64Async(new ScreenshotOptions()
                            {
                                Clip = new PuppeteerSharp.Media.Clip()
                                {
                                    Width = decimal.Parse(width),
                                    Height = decimal.Parse(height),
                                },
                                OmitBackground = true,
                            });

                            PdfReader reader2 = new PdfReader(a);
                            Rectangle rec = reader2.GetPageSize(1);
                            float ratio = (int)double.Parse(width) * 1f / (int)double.Parse(height);
                            float left = 0;
                            float bottom = rec.Height - rec.Width / ratio;
                            float right = rec.Width;
                            float top = rec.Height;

                            System.IO.MemoryStream msOutput3 = new System.IO.MemoryStream();
                            PdfDictionary pageDict;
                            PdfRectangle rect = new PdfRectangle(left, bottom, right, top);
                            pageDict = reader2.GetPageN(1);
                            pageDict.Put(PdfName.CROPBOX, rect);

                            //PdfStamper pdfStamper2 = new PdfStamper(reader2, new FileStream("/Users/llaugusty/Downloads/quynh2.pdf", FileMode.Create));

                            //iTextSharp.text.Rectangle pageRectangle = reader2.GetPageSizeWithRotation(1);
                            //PdfContentByte pdfData = pdfStamper2.GetOverContent(1);
                            //pdfData.SetFontAndSize(BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 10);
                            //PdfGState graphicsState = new PdfGState();
                            //graphicsState.FillOpacity = 0.4F;
                            //pdfData.SetGState(graphicsState);
                            //pdfData.BeginText();

                            //iTextSharp.text.Image jpeg = Image.GetInstance("https://www.pngfind.com/pngs/m/256-2563274_rose-flowers-love-yellow-roses-png-image-rose.png");
                            //float width2 = pageRectangle.Width;
                            //float height2 = pageRectangle.Height;
                            ////jpeg.ScaleToFit(width2, height2);
                            //jpeg.SetAbsolutePosition(100, 100);

                            ////jpeg.SetAbsolutePosition(width2 / 2 - jpeg.ScaledWidth / 2, height2 / 2 - jpeg.ScaledHeight / 2);
                            //jpeg.Rotation = 45;

                            //pdfData.AddImage(jpeg);

                            ////var text = "Other random blabla...";
                            ////// put the alignment and coordinates here
                            ////pdfData.ShowTextAligned(2, text, 100, 200, 0);

                            //pdfData.EndText();
                            ////msOutput3.Close();
                            ////pdfStamper2.Close();
                            //msOutput3.Position = 0;
                            ////PdfReader reader3 = new PdfReader(msOutput3);
                            pCopy.AddPage(pCopy.GetImportedPage(reader2, 1));
                            reader2.Close();
                        }
                    }

                    doc.Close();
                    pCopy.Close();
                    data = msOutput.ToArray();
                }

                //p.WaitForExit();

                return File(data, "application/pdf");

                //return Json(null);
            }
        }

        [HttpPost("[action]")]
        public async System.Threading.Tasks.Task<IActionResult> DownloadVideo(
            [FromQuery]string width,
            [FromQuery]string height,
            [FromQuery]string videoId
        ) {

            string body = null;
            using (var reader = new StreamReader(Request.Body))
            {
                body = reader.ReadToEnd();

                DownloadBody oDownloadBody = JsonConvert.DeserializeObject<DownloadBody>(body);

                string style = String.Empty;
                for (int i = 0; i < oDownloadBody.Fonts.Length; ++i)
                {
                    try
                    {
                        byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{oDownloadBody.Fonts[i]}.ttf");
                        String file = Convert.ToBase64String(AsBytes);

                        string s = $"@font-face {{ font-family: '{oDownloadBody.Fonts[i]}'; src: url('https://localhost:64099/fonts/{oDownloadBody.Fonts[i]}.ttf'); }}";
                        style += s;
                    }
                    catch (Exception e)
                    {

                    }
                }

                style += AppSettings.style;

                string template = AppSettings.templateDownload
                    .Replace("[ADDITIONAL_STYLE]", oDownloadBody.AdditionalStyle)
                    .Replace("[FONT_FACE]", style)
                    .Replace("[RECT_WIDTH]", width)
                    .Replace("[RECT_HEIGHT]", height);

                if (HostingEnvironment.IsProduction()) {
                    template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
                }

                byte[] data = null;
                using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
                {
                    iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                    iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                    doc.Open();
                    var canvas = oDownloadBody.Canvas;
                    for (var i = 0; i < canvas.Length; ++i)
                    {
                        var html = template.Replace("[CANVAS]", canvas[i]);
                        try
                        {
                            byte[] bytes = Encoding.ASCII.GetBytes(html);
                            using (var htmlFile = new FileStream("/Users/quynhnguyen/Downloads/quynh2.html", FileMode.Create))
                            {
                                htmlFile.Write(bytes, 0, bytes.Length);
                                htmlFile.Flush();
                            }
                        } catch (Exception e)
                        {

                        }
                        var path = "/app/wwwroot/test-extension";
                        var extensionId = "hkfcaghpglcicnlgjedepbnljbfhgmjg";
                        var executablePath = "/usr/bin/google-chrome-stable";
                        if (HostingEnvironment.IsDevelopment())
                        {
                            path = "F:\\Projects\\test-extension";
                            extensionId = "nkmodfdkigldbhmikgbbebdbggekljmo";
                            executablePath = Configuration.GetSection("chromeExePath").Get<string>();
                        }

                        List<string> arguments = new List<string>()
                        {
                            $"--whitelisted-extension-id={extensionId}",
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            "--ignore-certificate-errors",
                            $"--load-extension={path}",
                        };

                        if (HostingEnvironment.IsDevelopment())
                        {
                            arguments.Add($"--disable-extensions-except={path}");
                        }

                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            DefaultViewport = new ViewPortOptions()
                            {
                                Width = (int)double.Parse(width),
                                Height = (int)double.Parse(height),
                            },
                            ExecutablePath = executablePath,
                            Args = arguments.ToArray(),
                            Headless = false,
                            IgnoredDefaultArgs = new string[] { "--disable-extensions" },
                            IgnoreHTTPSErrors = true,
                        });

                        // await browser.WaitForTargetAsync(target => target.Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture));

                        Target backgroundPageTarget = null;
                        var targets = browser.Targets();
                        var len = targets.Length;
                        var text = "";
                        if (targets != null)
                        {
                            for (int t = 0; t < len; ++t)
                            {
                                if (targets[t] != null)
                                {
                                    text = text + "\n" + targets[t].Url;
                                }
                            }
                        }

                        try {
                        byte[] bytes2 = Encoding.ASCII.GetBytes(text);
                        using (var htmlFile = new FileStream("/app/log.txt", FileMode.Create))
                        {
                            htmlFile.Write(bytes2, 0, bytes2.Length);
                            htmlFile.Flush();
                        }
                        } catch (Exception e) {
                            
                        }

                        await browser.WaitForTargetAsync(target => target.Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture));


                        if (targets != null)
                        {
                            for (int t = 0; t < len; ++t)
                            {
                                if (targets[t] != null)
                                {
                                    if (targets[t].Type == TargetType.BackgroundPage && targets[t].Url != null && targets[t].Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture))
                                    {
                                        backgroundPageTarget = targets[t];
                                    }
                                }
                            }
                        }
                        //}
                        //++cnt;
                        //if (cnt > 5)
                        //{
                        //    break;
                        //} 
                        //}
                        if (backgroundPageTarget == null)
                        {
                            throw new Exception("Cannot get background pages.");
                        }

                        var backgroundPage = await backgroundPageTarget.PageAsync();

                        var page = await browser.NewPageAsync();
                        await page.SetContentAsync(html,
                                new NavigationOptions()
                                {
                                    WaitUntil = new WaitUntilNavigation[] { WaitUntilNavigation.DOMContentLoaded, },
                                    Timeout = 0,
                                }
                            );

                        await page.WaitForTimeoutAsync(5000);


                        if (backgroundPageTarget == null)
                        {
                            throw new Exception("Cannot get background pages.");
                        }

                        var messages = new List<ConsoleMessage>();

                        backgroundPage.Console += (sender, e) => messages.Add(e.Message);

                        var res = await backgroundPage.EvaluateFunctionAsync(@"() => {
                            startRecording('" + videoId + @"'," + width + @"," + height + @"); 
                            return Promise.resolve(42);
                        }");

                        while (true)
                        {
                            System.Threading.Thread.Sleep(1000);
                            var inp = "/app/wwwroot/" + videoId + ".webm";
                            if (HostingEnvironment.IsDevelopment())
                            {
                                inp = "./wwwroot/" + videoId + ".webm";
                            }

                            if (System.IO.File.Exists(inp))
                            {
                                await browser.CloseAsync();
                                break;
                            }
                        }

                        await backgroundPage.CloseAsync();
                        await page.CloseAsync();
                    }
                }

                int crf = 17;
                var exePath = "/usr/bin/ffmpeg";
                var inputArgs = "/app/wwwroot/" + videoId + ".webm -crf " + crf.ToString();
                var outputArgs = "/app/wwwroot/" + videoId + ".mp4";

                if (HostingEnvironment.IsDevelopment())
                {
                    exePath = "F:\\ffmpeg-20200716-d11cc74-win64-static\\bin\\ffmpeg.exe";
                    inputArgs = "./wwwroot" + "/" + videoId + ".webm -c:v copy ";
                    outputArgs = "./wwwroot" + "/" + videoId + ".mp4";
                }

                var process = new Process
                {
                    StartInfo =
                    {
                        FileName = exePath,
                        Arguments = $"-i {inputArgs} {outputArgs}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardInput = true
                    }
                };

                process.Start();
                process.WaitForExit();
                process.Close();

                byte[] file2 = System.IO.File.ReadAllBytes(outputArgs);

                return File(file2, "video/webm");
            }
        }

        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }

        [HttpGet("[action]")]
        public IActionResult Get([FromQuery]string id)
        {
            return Json(DesignService.Get(id));
        }

        [HttpGet("[action]")]
        public IActionResult GetDesignIfNotTemplate([FromQuery]string template_id, [FromQuery]string design_id)
        {
            var res = DesignService.Get(design_id);
            if (res.HasErrors) {
                var res2 = TemplateService.Get(template_id);

                return Json(res2);
            }

            return Json(res);
        }

        [HttpPost("[action]")]
        public IActionResult Upload([FromQuery]string id)
        {
            string imageContent = this.HttpContext.Request.Form["file"];

            string file2 = "images" + Path.DirectorySeparatorChar + Guid.NewGuid() + ".png";
            var filePath = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + file2);
            string base64 = imageContent.Substring(imageContent.IndexOf(',') + 1);
            byte[] data = Convert.FromBase64String(base64);
            using (var imageFile = new FileStream(filePath, FileMode.Create))
            {
                imageFile.Write(data, 0, data.Length);
                imageFile.Flush();
            }

            var result = DesignService.UpdateRepresentative(id, "/" + file2);

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
