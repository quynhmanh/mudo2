using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
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
        private IHostingEnvironment HostingEnvironment { get; set; }

        public DesignController(DesignService designService, IHostingEnvironment hostingEnvironment)
        {

            var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

            //_context = (DbContextOptions<PersonContext>)serviceCollection.BuildServiceProvider().GetServices(typeof(PersonContext)).First();

            DesignService = designService;
            HostingEnvironment = hostingEnvironment;
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

            TemplateService designService = new TemplateService(null, HostingEnvironment);

            string res = await designService.GenerateRepresentative(model, (int)model.Width, (int)model.Height, false, false, model.Representative);
            model.Representative = res;

            var result = DesignService.Add(model);
            return Json(result);
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

                string template = AppSettings.templateDownload.Replace("[ADDITIONAL_STYLE]", oDownloadBody.AdditionalStyle)
                    .Replace("[FONT_FACE]", style)
                    .Replace("[RECT_WIDTH]", width)
                    .Replace("[RECT_HEIGHT]", height);

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
                            using (var htmlFile = new FileStream("/Users/llaugusty/Downloads/quynh2.html", FileMode.Create))
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
        public async System.Threading.Tasks.Task<IActionResult> Download([FromQuery]string width, [FromQuery]string height)
        {

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
                        try
                        {
                            byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{oDownloadBody.Fonts[i]}.ttf");
                            String file = Convert.ToBase64String(AsBytes);

                            string s = $"@font-face {{ font-family: '{oDownloadBody.Fonts[i]}'; src: url(data:font/ttf;base64,{file} ); }}";
                            style += s;
                        }
                        catch (Exception e)
                        {

                        }
                    }
                } catch (Exception e)
                {

                }

                string template = AppSettings.templateDownload.Replace("[ADDITIONAL_STYLE]", oDownloadBody.AdditionalStyle)
                    .Replace("[FONT_FACE]", style)
                    .Replace("[RECT_WIDTH]", width)
                    .Replace("[RECT_HEIGHT]", height);

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
                        // byte[] bytes = Encoding.ASCII.GetBytes(html);
                        // using (var htmlFile = new FileStream("/Users/llaugusty/Downloads/quynh2.html", FileMode.Create))
                        // {
                        //     htmlFile.Write(bytes, 0, bytes.Length);
                        //     htmlFile.Flush();
                        // }

                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            DefaultViewport = new ViewPortOptions()
                            {
                                Width = (int)double.Parse(width),
                                Height = (int)double.Parse(height),
                            },
                            Args = new string[] { "--no-sandbox", "--disable-setuid-sandbox" },
                        }))
                        {
                            var page = await browser.NewPageAsync();
                            await page.SetContentAsync(html);
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
        public async System.Threading.Tasks.Task<IActionResult> DownloadVideo([FromQuery]string width, [FromQuery]string height)
        {

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
                        byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{oDownloadBody.Fonts[i]}.ttf");
                        String file = Convert.ToBase64String(AsBytes);

                        string s = $"@font-face {{ font-family: '{oDownloadBody.Fonts[i]}'; src: url(data:font/ttf;base64,{file} ); }}";
                        style += s;
                    }
                } catch (Exception e)
                {

                }

                string template = AppSettings.templateDownload.Replace("[ADDITIONAL_STYLE]", oDownloadBody.AdditionalStyle)
                    .Replace("[FONT_FACE]", style)
                    .Replace("[RECT_WIDTH]", width)
                    .Replace("[RECT_HEIGHT]", height);

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
                        //byte[] bytes = Encoding.ASCII.GetBytes(html);
                        //using (var htmlFile = new FileStream("/Users/llaugusty/Downloads/quynh2.html", FileMode.Create))
                        //{
                        //    htmlFile.Write(bytes, 0, bytes.Length);
                        //    htmlFile.Flush();
                        //}

                        var path = "/Users/llaugusty/Downloads/puppeteer-tab-capture-repro-master/test-extension";
                        var extensionId = "faffmpnegcamgkccjjginaailmnoldhn";
                         var args = new string[] {
            $"--whitelisted-extension-id={extensionId}",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            $"--disable-extensions-except={path}",
            $"--load-extension={path}"
                        };

                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            DefaultViewport = new ViewPortOptions()
                            {
                                Width = int.Parse(width),
                                Height = int.Parse(height),
                            },
                            ExecutablePath = "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
                            Args = args,
                            Headless = false,
                        });

                        var page = await browser.NewPageAsync();
                        await page.SetContentAsync(html,
                            new NavigationOptions()
                            {
                                WaitUntil = new WaitUntilNavigation[] { WaitUntilNavigation.Networkidle0, },
                            });

                        var targets = browser.Targets();
                        Target backgroundPageTarget = null;
                        for (int t = 0; t < targets.Length; ++t)
                        {
                            if (targets[t].Type == TargetType.BackgroundPage && targets[t].Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture))
                            {
                                backgroundPageTarget = targets[t];
                            }
                        }

                        var backgroundPage = await backgroundPageTarget.PageAsync();

                        var messages = new List<ConsoleMessage>();

                        backgroundPage.Console += (sender, e) => messages.Add(e.Message);

                        var res = await backgroundPage.EvaluateFunctionAsync(@"() => {
        startRecording();
console.log('asdasd');
        return Promise.resolve(42);
    }");

                        await backgroundPage.WaitForTimeoutAsync(12 * 1000);

                        //                        string b = await page.ScreenshotBase64Async(new ScreenshotOptions()
                        //                        {
                        //                            Clip = new PuppeteerSharp.Media.Clip()
                        //                            {
                        //                                Width = decimal.Parse(width),
                        //                                Height = decimal.Parse(height),
                        //                            }
                        //                        });

                        //                        var exePath = "/Users/llaugusty/Downloads/ffmpeg";

                        //                        var inputArgs = "-framerate 40 -f image2pipe -pix_fmt rgb32 -video_size 1920x1080 -i -";
                        //                        var outputArgs = "-vcodec libx264 -crf 23 -pix_fmt yuv420p -preset ultrafast -r 20 out.mp4";

                        //                        var process = new Process
                        //                        {
                        //                            StartInfo =
                        //    {
                        //        FileName = exePath,
                        //        Arguments = $"{inputArgs} {outputArgs}",
                        //        UseShellExecute = false,
                        //        CreateNoWindow = true,
                        //        RedirectStandardInput = true
                        //    }
                        //                        };

                        //                        process.Start();

                        //                        var ffmpegIn = process.StandardInput.BaseStream;


                        //                        PdfReader reader2 = new PdfReader(a);
                        //                        Rectangle rec = reader2.GetPageSize(1);
                        //                        float ratio = int.Parse(width) * 1f / int.Parse(height);
                        //                        float left = 0;
                        //                        float bottom = rec.Height - rec.Width / ratio;
                        //                        float right = rec.Width;
                        //                        float top = rec.Height;

                        //                        System.IO.MemoryStream msOutput3 = new System.IO.MemoryStream();
                        //                        PdfDictionary pageDict;
                        //                        PdfRectangle rect = new PdfRectangle(left, bottom, right, top);
                        //                        pageDict = reader2.GetPageN(1);
                        //                        pageDict.Put(PdfName.CROPBOX, rect);

                        //                        double currentTime = 0;

                        //                        for (int j = 0; j <= 1000; ++j, currentTime += 0.025)
                        //                        {
                        //                            var res = await page.EvaluateFunctionAsync(@"(currentTime) => {
                        //  var videos = document.getElementsByTagName(""video"");
                        //  for (var i = 0; i < videos.length; ++i)
                        //  {
                        //      videos[i].currentTime = currentTime;
                        //  }
                        //}", currentTime);

                        //                            Stream aa = await page.ScreenshotStreamAsync(new ScreenshotOptions()
                        //                            {
                        //                                Clip = new PuppeteerSharp.Media.Clip()
                        //                                {
                        //                                    Width = decimal.Parse(width),
                        //                                    Height = decimal.Parse(height),
                        //                                },
                        //                            });

                        //                            try
                        //                            {
                        //                                //ffmpegIn.Position = ffmpegIn.Length;
                        //                                ffmpegIn.Write(ReadFully(aa));
                        //                            } catch (Exception)
                        //                            {

                        //                            }
                        //                        }


                        //                        // After you are done
                        //                        ffmpegIn.Flush();
                        //                        ffmpegIn.Close();

                        //                        process.WaitForExit();
                        //                        process.Close();

                        //                        pCopy.AddPage(pCopy.GetImportedPage(reader2, 1));
                        //                        reader2.Close();
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
