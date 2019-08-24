using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Specialized;
using System.Web;
using System.Net.Http;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RCB.TypeScript.Models;
using RCB.TypeScript.dbcontext;
using Microsoft.EntityFrameworkCore;
using RCB.TypeScript.Services;

namespace RCB.TypeScript.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private IUserService _userService;
        private UserContext _userContext;

        public UsersController(IUserService userService)
        {
            _userService = userService;

        }

        [AllowAnonymous]
        [HttpPost("~/users/authenticate")]
        public IActionResult Authenticate([FromBody]User userParam)
        {
            var user = _userService.Authenticate(userParam.Username, userParam.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet("~/users/authenticate/external")]
        public IActionResult External(string provider)
        {
            if (string.IsNullOrEmpty(provider))
            {
                return BadRequest(new { message = $"An internal error has occurred (provider not supported '{provider}')" });
            }

            return View("Authorized");
        }

        [AllowAnonymous]
        [HttpPost("~/users/authenticate/external/verify")]
        public IActionResult verify([FromBody]Auth auth)
        {
            if (auth.Scope == null || !auth.Scope.ToLower().Contains("email"))
                return BadRequest(new { message = "The following permissions have not been approved for use: email." });
            switch (auth.Provider)
            {
                case "facebook":
                    return verifyFacebook(auth);
                case "google":
                    return verifyGoogle(auth);
                default:
                    return BadRequest(new { message = $"An internal error has occurred (provider not supported '{auth.Provider}')" });
            }
        }

        private IActionResult verifyFacebook(Auth auth)
        {
            const string APP_ID = "476336289816631";
            string appAccessToken = "476336289816631|TsZNusrq4En3B0_RZU79_gsBFX8";
            string url = "https://graph.facebook.com/debug_token?input_token=" + auth.Token + "&access_token=" + appAccessToken;
            string result = "";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = client.GetAsync(url).Result;
                    response.EnsureSuccessStatusCode();
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    result = responseBody;
                }
                catch (HttpRequestException e)
                {

                }
            }

            JObject json = JObject.Parse(result);
            if (json.ContainsKey("data"))
            {
                JObject data = (JObject)json.GetValue("data");
                if (data.ContainsKey("app_id") && data.ContainsKey("is_valid") && data.ContainsKey("user_id"))
                {
                    string app_id = (string)data.GetValue("app_id");
                    bool is_valid = (bool)data.GetValue("is_valid");
                    string user_id = (string)data.GetValue("user_id");
                    if (is_valid && app_id.Equals(APP_ID))
                    {
                        return GetFacebookInfo(auth.Token);
                    }
                }
            }
            return BadRequest(new { message = "Invalid Access Token!" });
        }

        private IActionResult GetFacebookInfo(string token) {
            string url = "https://graph.facebook.com/v4.0/me?fields=name,email&access_token=" + token;
            string result = "";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = client.GetAsync(url).Result;
                    response.EnsureSuccessStatusCode();
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    result = responseBody;
                }
                catch (HttpRequestException e)
                {
                    
                }
            }

            JObject json = JObject.Parse(result);
            if (result.Contains("email")) {
                return Ok(new User { Username = (string) json.GetValue("email") });
            }

            return BadRequest(new { message = "Invalid Access Token!" });
        }

        private IActionResult verifyGoogle(Auth auth)
        {
            /*
                The tokeninfo endpoint is useful for debugging but for production purposes, 
                retrieve Google’s public keys from the keys endpoint and perform the validation locally.
            */
            /*
                {
                    "azp": "31145972728-h4run59tenujvr68u89m5p9ibgo9inat.apps.googleusercontent.com",
                    "aud": "31145972728-h4run59tenujvr68u89m5p9ibgo9inat.apps.googleusercontent.com",
                    "sub": "106488946935451153824",
                    "scope": "openid https://www.googleapis.com/auth/userinfo.email",
                    "exp": "1565712202",
                    "expires_in": "3582",
                    "email": "abc@gmail.com",
                    "email_verified": "true",
                    "access_type": "online"
                }
                https://developers.google.com/identity/protocols/OpenIDConnect
            */
            const string CLIENT_ID = "75521893646-ejv81aiajee0gkt0ebs3pkohhubj47k1.apps.googleusercontent.com";
            string url = "https://oauth2.googleapis.com/tokeninfo?access_token=" + auth.Token;
            string result = "";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = client.GetAsync(url).Result;
                    response.EnsureSuccessStatusCode();
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    result = responseBody;
                }
                catch (HttpRequestException e)
                {

                }
            }

            JObject data = JObject.Parse(result);

            if (data.ContainsKey("aud") && data.ContainsKey("email"))
            {
                string aud = (string)data.GetValue("aud");
                string email = (string)data.GetValue("email");

                var user = new User { Username = email };
                _userService.Add(user);

                if (aud.Equals(CLIENT_ID))
                {
                    return Ok(new User { Username = email });
                }
            }

            return BadRequest(new { message = "Invalid Access Token!" });
        }
    }
}