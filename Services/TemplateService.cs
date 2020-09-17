using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iTextSharp.text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.EntityFrameworkCore;
using Nest;
using Newtonsoft.Json;
using PuppeteerSharp;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Models;
using Microsoft.Extensions.Configuration;

namespace RCB.TypeScript.Services
{
    public class TemplateService : ServiceBase
    {
        const string DefaultIndex = "template-04";
        private IHostingEnvironment HostingEnvironment { get; set; }
        private IConfiguration Configuration { get; set; }

        public TemplateService(TemplateContext templateContext, IHostingEnvironment hostingEnvironment, IConfiguration configuration)
        {
            HostingEnvironment = hostingEnvironment;
            Configuration = configuration;
        }

        public Result<int> MakeAsPopulate(string id)
        {
            Result<TemplateModel> templateResult = this.Get(id);
            var model = templateResult.Value;
            model.Popular = true;

            this.Update(model);

            return Ok(1);
        }

        public virtual Result<KeyValuePair<List<TemplateModel>, long>> Search(string type = null, int page = 1, int perPage = 5, string filePath = "", string subType = "", string printType = "")
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex).DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 10));
            var client = new ElasticClient(settings);
            string query = $"type:{type}";

            if (printType != null && printType.Length > 0)
            {
                query = query + $" AND printType:{printType}";
            }

            var res = client.Search<TemplateModel>(s =>
                // Query(q => q.QueryString(d => d.Query(query)))
                s.Query(t => t.Bool(b => b.Must(
                    q => q.Match(c => c.Field(p => p.Type).Query(type)),
                    q => q.Match(c => c.Field(p => p.PrintType).Query(printType)),
                    q => q.Match(c => c.Field(p => p.Delete).Query("false")))))
                .From((page - 1) * perPage)
                .Size(perPage)
                .Aggregations(a => a.Terms("my_agg", t => t.Field("subType"))));

            var res2 = new KeyValuePair<List<TemplateModel>, long>(res.Documents.ToList(), res.Total);

            return Ok(res2);
        }

        public virtual Result<KeyValuePair<List<TemplateModel>, long>> SearchWithUserName(string userName, int page, int perPage)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex)
            .DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 1));
            var client = new ElasticClient(settings);
            string query = $"UserName:{userName}";

            var res = client.Search<TemplateModel>(s =>
            s.Query(t => t.Bool(b => b.Must(
                q => q.Match(c => c.Field(p => p.UserName).Query(userName)),
                q => q.Match(c => c.Field(p => p.Delete).Query("false")))))
                .From((page - 1) * perPage)
                .Size(perPage));

            var res2 = new KeyValuePair<List<TemplateModel>, long>(res.Documents.ToList(), res.Total);

            return Ok(res2);
        }

        public virtual Result<KeyValuePair<List<TemplateModel>, long>> SearchPopularTemplates(int page = 1, int perPage = 5)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex)
            .DisableDirectStreaming().RequestTimeout(new TimeSpan(0, 0, 3));
            var client = new ElasticClient(settings);

            var res = client.Search<TemplateModel>(s =>
            s.Query(t => t.Bool(b => b.Must(
                q => q.Match(c => c.Field(p => p.Popular).Query("true")),
                q => q.Match(c => c.Field(p => p.Delete).Query("false")))))
                .Sort(f => f.Descending(ff => ff.Popularity))
                .From((page - 1) * perPage)
                .Size(perPage));

            var res2 = new KeyValuePair<List<TemplateModel>, long>(res.Documents.ToList(), Math.Max(0, res.Total));

            return Ok(res2);
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

        public async Task<byte[]> DownloadVideo(
            string width,
            string height,
            string videoId,
            TemplateModel model
        )
        {

            var filePath = "/app/wwwroot/" + videoId + ".webm";
            if (HostingEnvironment.IsDevelopment())
            {
                filePath = "/Users/llaugusty/Downloads/" + videoId + ".webm";
            }

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            string style = AppSettings.style;
            for (int i = 0; i < model.FontList.Length; ++i)
            {
                try
                {
                    byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{model.FontList[i]}.ttf");
                    String file = Convert.ToBase64String(AsBytes);

                    string s = $"@font-face {{ font-family: '{model.FontList[i]}'; src: url(data:font/ttf;base64,{file} ); }}";
                    style += s;
                }
                catch (Exception e)
                {

                }
            }

            string template = AppSettings
                .templateDownload.Replace("[ADDITIONAL_STYLE]", model.AdditionalStyle)
                .Replace("[FONT_FACE]", style)
                .Replace("[RECT_WIDTH]", width)
                .Replace("[RECT_HEIGHT]", height);

            if (HostingEnvironment.IsProduction())
            {
                template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
            }

            byte[] data = null;
            using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
            {
                iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                doc.Open();
                var canvas = model.Canvas;
                for (var i = 0; i < canvas.Length; ++i)
                {
                    var html = template.Replace("[CANVAS]", canvas[i]);
                    var path = "/app/wwwroot/test-extension";
                    var extensionId = "hkfcaghpglcicnlgjedepbnljbfhgmjg";
                    var executablePath = "/usr/bin/google-chrome-stable";
                    if (HostingEnvironment.IsDevelopment())
                    {
                        executablePath = Configuration.GetSection("chromeExePath").Get<string>();
                        path = "/Users/llaugusty/Downloads/puppeteer-tab-capture-repro/test-extension";
                        extensionId = "ihfahmlcdcnbdmbjlohjpgbiknhljmdc";
                    }

                    List<string> arguments = new List<string>()
                        {
                            $"--whitelisted-extension-id={extensionId}",
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            $"--load-extension={path}"
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

                    await browser.WaitForTargetAsync(target => target.Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture));

                    Target backgroundPageTarget = null;
                    var targets = browser.Targets();
                    var len = targets.Length;
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
                                WaitUntil = new WaitUntilNavigation[] { WaitUntilNavigation.Networkidle0, },
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
                            inp = "/Users/llaugusty/Downloads" + "/" + videoId + ".webm";
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

            int crf = 35;
            var exePath = "/usr/bin/ffmpeg";
            var inputArgs = "/app/wwwroot/" + videoId + ".webm -crf " + crf.ToString();
            var outputArgs = "/app/wwwroot/" + videoId + ".mp4";

            if (HostingEnvironment.IsDevelopment())
            {
                exePath = "/usr/local/bin/ffmpeg";
                inputArgs = "/Users/llaugusty/Downloads" + "/" + videoId + ".webm -crf " + crf.ToString();
                outputArgs = "/Users/llaugusty/Downloads" + "/" + videoId + ".mp4";
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

            return file2;
        }

        public class ResultSearchAngAggregate
        {
            public long Count { get; set; }
            public List<TemplateModel> Documents { get; set; }
            public Dictionary<string, long?> Aggregation { get; set; }
        }

        public virtual Result<ResultSearchAngAggregate> SearchAngAggregate(string type = null, int page = 1, int perPage = 5, string filePath = "", string subType = "")
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex).DisableDirectStreaming();
            var client = new ElasticClient(settings);

            //var response = client.Indices.Create("template", c => c
            //    .Settings(s => s.Analysis(a => a.Analyzers(ar => ar.Custom("custom_path_tree", ac => ac.Tokenizer("custom_hierarchy")))))
            //    .Map<TemplateModel>(mm => mm.Properties(props => props
            //        .Keyword(t => t.Name(p => p.SubType))
            //        .Text(pt => pt.Name(ptp => ptp.FilePath).Fields(ptf => ptf.Text(ptft => ptft.Name("tree").Analyzer("custom_path_tree")))))));


            //props
            //.Keyword(t => t.Name(p => p.SubType))
            //    && props.Text(pt => pt.Fields(ptf => ptf.Text(ptft => ptft.Analyzer("custom_path_tree")))))))
            //);

            string query = $"type:{type}";

            var res = client.Search<TemplateModel>(s => s.
                                //Query(q => q.Term(t => t.Field(f => f.FilePathTree).Value(filePath)))
                                Query(q => q.QueryString(d => d.Query(query)) && q.Term(t => t.Field(f => f.FilePathTree).Value(filePath)))
                                .From((page - 1) * perPage).Take(perPage)
                                .Source(src => src.IncludeAll().Excludes(e => e.Fields(p => p.Document)))
                                .Aggregations(a => a.Terms("my_agg", t => t.Field("subType"))));


            Dictionary<string, long?> aggregations = new Dictionary<string, long?>();

            foreach (var i in res.Aggregations.Terms("my_agg")?.Buckets)
            {
                aggregations.Add(i.Key, i.DocCount);
            }

            var res2 = new ResultSearchAngAggregate()
            {
                Documents = res.Documents.ToList(),
                Aggregation = aggregations,
                Count = res.Total,
            };

            return Ok(res2);
        }

        public virtual Result<TemplateModel> Get(string id)
        {

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var response = client.Get<TemplateModel>(id);

            return Ok(response.Source);
        }

        public virtual Result<string> Add(TemplateModel model)
        {
            if (model == null)
                return Error<string>();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node);
            var client = new ElasticClient(settings);

            var response = client.Index(model, idx => idx.Index(DefaultIndex));

            return Ok(response.Id);
        }

        public virtual Infrastructure.Result Update(TemplateModel model)
        {
            if (model == null)
                return Error();

            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(model.Id);

            var template = getResponse.Source;

            template = model;

            template.Title = model.Title;
            template.Document = model.Document;
            template.CreatedAt = model.CreatedAt;
            template.CreatedBy = model.CreatedBy;
            template.UpdatedAt = model.UpdatedAt;
            template.UpdatedBy = model.UpdatedBy;
            template.FontList = model.FontList;
            template.Type = model.Type;
            template.Width = model.Width;
            template.Height = model.Height;
            template.Keywords = model.Keywords;
            template.FirstName = model.FirstName;
            template.Representative = model.Representative;
            template.Representative2 = model.Representative2;
            template.IsVideo = model.IsVideo;
            template.VideoRepresentative = model.VideoRepresentative;
            template.Pages = model.Pages;
            template.Popular = model.Popular;
            template.Delete = model.Delete;
            template.IsVideo = model.IsVideo;
            template.Popularity = model.Popularity;

            var updateResponse = client.Update<TemplateModel>(template, u => u.Doc(template));

            return Ok();
        }

        public virtual Infrastructure.Result Delete(string id)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            Result<TemplateModel> templateResult = this.Get(id);
            var model = templateResult.Value;
            model.Delete = true;

            var res = this.Update(model);

            return Ok(res);
        }

        public virtual Infrastructure.Result Undelete(string id)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            Result<TemplateModel> templateResult = this.Get(id);
            var model = templateResult.Value;
            model.Delete = false;

            var res = this.Update(model);

            return Ok(res);
        }

        public virtual Infrastructure.Result UpdateRepresentative(string id, string filePath)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(id);

            var page = getResponse.Source;

            page.Representative = filePath;
            var updateResponse = client.Update<TemplateModel>(page, u => u.Doc(page));

            return Ok();
        }

        //private static void TrimStrings(PersonModel model)
        //{
        //    model.FirstName = model.FirstName.Trim();
        //    model.LastName = model.LastName.Trim();
        //}

        public virtual Result<int> RemoveAll()
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var res = client.DeleteByQuery<TemplateModel>(q => q.MatchAll());
            return Ok(1);
        }

        public virtual Result<int> Edit(TemplateModel model)
        {
            var node = new Uri(elasticsearchAddress);
            var settings = new ConnectionSettings(node).DefaultIndex(DefaultIndex);
            var client = new ElasticClient(settings);

            var getResponse = client.Get<TemplateModel>(model.Id);

            var page = getResponse.Source;

            page.FirstName = model.FirstName;
            page.Keywords = model.Keywords;
            page.FilePath = model.FilePath;
            page.SubType = model.SubType;

            var updateResponse = client.Update<TemplateModel>(page, u => u.Doc(page));


            return Ok(1);
        }

        public async virtual Task<string> GenerateRepresentative(ITemplateBaseModel templateModel, int width, int height, Boolean preview, Boolean backgroundBlack, string path, bool omitBackground = false)
        {
            string resPath = null;
            string style = AppSettings.style;
            for (int i = 0; i < templateModel.FontList.Length; ++i)
            {
                try
                {
                    byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{templateModel.FontList[i]}.ttf");
                    String file = Convert.ToBase64String(AsBytes);

                    string s = $"@font-face {{ font-family: '{templateModel.FontList[i]}'; src: url(data:font/ttf;base64,{file} ); }}";
                    style += s;
                }
                catch (Exception e)
                {

                }
            }

            string additionalStyle = "";
            if (omitBackground)
            {
                additionalStyle = $".alo2 {{background-color: transparent !important; }}";
            }

            var template = AppSettings.templateDownload.Replace("[ADDITIONAL_STYLE]", additionalStyle);

            if (HostingEnvironment.IsProduction())
            {
                template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
            }

            template = template.Replace("[FONT_FACE]", style);
            byte[] data = null;
            using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
            {
                iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                doc.Open();
                string[] canvas;
                if (preview)
                {
                    canvas = templateModel.Canvas2;
                }
                else
                {
                    canvas = templateModel.Canvas;
                }
                var cv = canvas[0];
                // for (var i = 0; i < canvas.Length; ++i)
                // {
                var html = template.Replace("[CANVAS]", cv);
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

                var executablePath = "/usr/bin/google-chrome-stable";
                if (HostingEnvironment.IsDevelopment())
                {
                    executablePath = Configuration.GetSection("chromeExePath").Get<string>();
                }

                await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = false,
                    DefaultViewport = new ViewPortOptions()
                    {
                        Width = width,
                        Height = height,
                    },
                    ExecutablePath = executablePath,
                    Args = new string[] { "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", },
                    IgnoreHTTPSErrors = true,
                }))
                {


                    var page = await browser.NewPageAsync();

                    await page.SetContentAsync(html,
                        new NavigationOptions()
                        {
                            WaitUntil = new WaitUntilNavigation[] { WaitUntilNavigation.DOMContentLoaded, WaitUntilNavigation.Load, },
                            Timeout = 0,
                        });

                    Stream a = await page.ScreenshotStreamAsync(new ScreenshotOptions()
                    {
                        Clip = new PuppeteerSharp.Media.Clip()
                        {
                            Width = (decimal)width,
                            Height = (decimal)height,
                        },
                        Type = ScreenshotType.Png,
                        // Quality = 90,
                        OmitBackground = true,
                    });

                    using (var memoryStream = new MemoryStream())
                    {
                        a.CopyTo(memoryStream);
                        data = memoryStream.ToArray();
                    }

                    var filePathRep = Path.Combine(HostingEnvironment.WebRootPath + Path.DirectorySeparatorChar + path);

                    using (var imageFile = new FileStream(filePathRep, FileMode.Create))
                    {
                        imageFile.Write(data, 0, data.Length);
                        imageFile.Flush();
                    }
                }
            }

            return resPath;
        }


        public async virtual Task<string> GenerateVideoRepresentative(TemplateModel templateModel, int width, int height, Boolean preview, Boolean backgroundBlack, string videoPath, bool omitBackground = false)
        {
            string style = String.Empty;
            for (int i = 0; i < templateModel.FontList.Length; ++i)
            {
                try
                {
                    byte[] AsBytes = System.IO.File.ReadAllBytes($"./wwwroot/fonts/{templateModel.FontList[i]}.ttf");
                    String file = Convert.ToBase64String(AsBytes);

                    string s = $"@font-face {{ font-family: '{templateModel.FontList[i]}'; src: url('https://localhost:64099/fonts/{templateModel.FontList[i]}.ttf'); }}";
                    style += s;
                }
                catch (Exception e)
                {

                }
            }


            string template = AppSettings.templateDownload
                .Replace("[ADDITIONAL_STYLE]", "")
                .Replace("[FONT_FACE]", style)
                .Replace("[RECT_WIDTH]", width.ToString())
                .Replace("[RECT_HEIGHT]", height.ToString());

            if (HostingEnvironment.IsProduction())
            {
                template = template.Replace("https://localhost:64099", "http://167.99.73.132:64099");
            }

            byte[] data = null;
            using (System.IO.MemoryStream msOutput = new System.IO.MemoryStream())
            {
                iTextSharp.text.Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                iTextSharp.text.pdf.PdfSmartCopy pCopy = new iTextSharp.text.pdf.PdfSmartCopy(doc, msOutput);
                doc.Open();
                var canvas = templateModel.Canvas2;
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
                    var path = "/app/wwwroot/test-extension";
                    var extensionId = "elindhcnkcamdgnhiedjalfojeindigm";
                    var executablePath = "/usr/bin/google-chrome-stable";

                    if (HostingEnvironment.IsDevelopment())
                    {
                        path = Configuration.GetSection("extensionPath").Get<string>();
                        extensionId = Configuration.GetSection("extensionId").Get<string>();
                        executablePath = Configuration.GetSection("chromeExePath").Get<string>();
                    }

                    List<string> arguments = new List<string>()
                        {
                            $"--whitelisted-extension-id={extensionId}",
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
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
                            Width = width,
                            Height = height,
                        },
                        ExecutablePath = executablePath,
                        Args = arguments.ToArray(),
                        Headless = false,
                        IgnoredDefaultArgs = new string[] { "--disable-extensions" },
                        IgnoreHTTPSErrors = true,
                    });

                    await browser.WaitForTargetAsync(target => target.Url.StartsWith($"chrome-extension://{extensionId}/", StringComparison.CurrentCulture));

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
                    try
                    {

                        byte[] bytes2 = Encoding.ASCII.GetBytes(text);
                        using (var htmlFile = new FileStream("/app/log.txt", FileMode.Create))
                        {
                            htmlFile.Write(bytes2, 0, bytes2.Length);
                            htmlFile.Flush();
                        }
                    }
                    catch (Exception e)
                    {

                    }

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

                    var inp = "/app/wwwroot/" + templateModel.Id + ".webm";
                    if (HostingEnvironment.IsDevelopment())
                    {
                        inp = "./wwwroot/" + templateModel.Id + ".webm";
                    }
                    if (File.Exists(inp)) File.Delete(inp);

                    var res = await backgroundPage.EvaluateFunctionAsync(@"() => {
                            startRecording('" + templateModel.Id + @"'," + width + @"," + height + @"); 
                            return Promise.resolve(42);
                        }");

                    await page.EvaluateFunctionAsync(@"() => {
                            let videos = document.getElementsByTagName('video'); 
                            for (let i = 0; i < videos.length; ++i) videos[i].currentTime = 0;
                        }");

                    while (true)
                    {
                        System.Threading.Thread.Sleep(1000);
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
            var inputArgs = "/app/wwwroot/" + templateModel.Id + ".webm -crf " + crf.ToString();
            var outputArgs = "/app/wwwroot/videos/" + templateModel.Id + ".mp4";

            if (HostingEnvironment.IsDevelopment())
            {
                // exePath = "F:\\ffmpeg-20200716-d11cc74-win64-static\\bin\\ffmpeg.exe";
                exePath = Configuration.GetSection("ffmpegPath").Get<string>();
                inputArgs = "./wwwroot" + "/" + templateModel.Id + ".webm -c:v copy ";
                outputArgs = "./wwwroot" + "/videos/" + templateModel.Id + ".mp4";
            }

            if (File.Exists(outputArgs))
            {
                File.Delete(outputArgs);
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

            return "";
        }
    }
}
