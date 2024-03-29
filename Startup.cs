using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RCB.TypeScript.dbcontext;
using RCB.TypeScript.Extensions.Microsoft.Extensions.DependencyInjection;
using RCB.TypeScript.Infrastructure;
using RCB.TypeScript.Services;
using Serilog;
using RCB.TypeScript.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace RCB.TypeScript
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            Configuration.GetSection("AppSettings").Bind(AppSettings.Default);

            services.AddLogging(loggingBuilder =>
                loggingBuilder
                    .AddSerilog(dispose: true)
                    .AddAzureWebAppDiagnostics()
                );
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddNodeServices();
            services.AddSpaPrerenderer();

            // Add your own services here.
            services.Configure<TokenManagement>(Configuration.GetSection("tokenManagement"));
            var token = Configuration.GetSection("tokenManagement").Get<TokenManagement>();
            var secret = Encoding.ASCII.GetBytes(token.Secret);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =  new SymmetricSecurityKey(secret),
                    ValidIssuer = token.Issuer,
                    ValidAudience = token.Audience,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services
                .AddScoped<TemplateService>()
                .AddDbContext<TemplateContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();

            services.AddEntityFrameworkNpgsql()
                .AddScoped<DesignService>()
                .AddDbContext<DesignContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();

            // Add framework services.
            services.AddEntityFrameworkNpgsql()
               .AddScoped<PersonService>()
               .AddDbContext<PersonContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
               .BuildServiceProvider();

            services
                .AddScoped<FontService>()
                .AddDbContext<FontContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();

            services
                .AddScoped<MediaService>()
                .AddDbContext<MediaContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();

            services
                .AddScoped<OrderService>()
                .AddDbContext<OrderContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();

            services.AddScoped<ITokenService, TokenService>();

            services
                .AddScoped<UserService>()
                .AddDbContext<UserContext>(options => 
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")))
                .BuildServiceProvider();


            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {   
            app.UseMiddleware<ExceptionMiddleware>();

            // Build your own authorization system or use Identity.
            app.Use(async (context, next) =>
            {
                var userService = (UserService)context.RequestServices.GetService(typeof(UserService));
                var verifyResult = userService.Verify(context);
                if (!verifyResult.HasErrors)
                {
                    context.Items.Add(Constants.HttpContextServiceUserItemKey, verifyResult.Value);
                }
                await next.Invoke();
                // Do logging or other work that doesn't write to the Response.
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Main/Error");
            }

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Main}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Main", action = "Index" });
            });
        }
    }
}
