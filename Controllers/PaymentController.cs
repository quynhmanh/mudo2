using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebApi.Services;
using System.Collections.Specialized;
using System.Web;
using System.Net.Http;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using MoMo;
using System.Net;
using RCB.TypeScript.Models;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    public class PaymentController : Controller
    {
        const string SERECT_KEY = "dUOqGzGqGBHtrqx6wuKaBUNx6VY2u7oJ";
        const string partnerCode = "MOMOM5WM20190817";
        const string accessKey = "yNr1FBtVDI0E1CEg";

        [AllowAnonymous]
        [HttpGet("~/payments/momo")]
        public IActionResult getPayUrl()
        {
            var baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

            const string url = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
            string requestId = Guid.NewGuid().ToString(); //
            const string amount = "100000";
            string orderId = Guid.NewGuid().ToString(); //
            const string orderInfo = "1-Month Membership Subscription";
            string returnUrl = baseURL + "/payments/momo/return";
            string notifyUrl = baseURL + "/payments/momo/notify";
            const string extraData = ""; //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store
            const string requestType = "captureMoMoWallet";

             //before sign HMAC SHA256 signature
            string rawHash = "partnerCode=" + partnerCode 
                + "&accessKey=" + accessKey
                + "&requestId=" + requestId
                + "&amount=" + amount 
                + "&orderId="+ orderId 
                + "&orderInfo="+ orderInfo 
                + "&returnUrl="+ returnUrl 
                + "&notifyUrl=" + notifyUrl 
                + "&extraData="+ extraData;

            MoMoSecurity crypto = new MoMoSecurity();
            //sign signature SHA256
            string signature = crypto.signSHA256(rawHash, SERECT_KEY);

             //build body json request
            JObject message = new JObject
            {
                { "partnerCode", partnerCode },
                { "accessKey", accessKey },
                { "requestId", requestId },
                { "amount", amount },
                { "orderId", orderId },
                { "orderInfo", orderInfo },
                { "returnUrl", returnUrl },
                { "notifyUrl", notifyUrl },
                { "requestType", requestType },
                { "signature", signature }
            };

            try {
                string responseFromMomo = PaymentRequest.sendPaymentRequest(url, message.ToString());
                JObject jmessage = JObject.Parse(responseFromMomo);
                if (jmessage.ContainsKey("payUrl"))
                    return Ok(responseFromMomo);
            } catch (WebException e) {

            }
            return BadRequest(new { message = "Exception occurs while process order request" });
        }

        [AllowAnonymous]
        [HttpGet("~/payments/momo/return")]
        public IActionResult returnUrl() {
            // MoMo Server to our client
            return View("MoMoPaymentReturnUrl");
        }

        [AllowAnonymous]
        [HttpPost("~/payments/momo/notify")]
        public IActionResult notifyUrl([FromBody]MoMoParameters momoResponse) {
            // MoMo server to our server
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("~/payments/momo/status")]
        public IActionResult getMomoStatus([FromBody]MoMoParameters momoParam) {
            string url = "https://test-payment.momo.vn/gw_payment/transactionProcessor";

            string requestType = "transactionStatus";
            string rawHash = "partnerCode=" + partnerCode 
                + "&accessKey=" + accessKey
                + "&requestId=" + momoParam.RequestId
                + "&orderId="+ momoParam.OrderId
                + "&requestType=" + requestType;
            
            MoMoSecurity crypto = new MoMoSecurity();
            string signature = crypto.signSHA256(rawHash, SERECT_KEY);

            JObject message = new JObject
            {
                { "partnerCode", partnerCode },
                { "accessKey", accessKey },
                { "requestId", momoParam.RequestId },
                { "orderId", momoParam.OrderId },
                { "requestType", requestType },
                { "signature", signature }
            };

            try {
                string responseFromMomo = PaymentRequest.sendPaymentRequest(url, message.ToString());
                MoMoParameters result = JsonConvert.DeserializeObject<MoMoParameters>(responseFromMomo);
                result.AccessKey = result.PartnerCode = result.Signature = null;
                return Ok(result);
            } catch (WebException e) {

            }
            return BadRequest(new { message = "Exception occurs while process order request" });
        }
    }
} 