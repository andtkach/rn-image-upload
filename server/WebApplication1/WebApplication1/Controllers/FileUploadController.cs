using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(ILogger<FileUploadController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("File upload servcie");
        }
        
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {   
                var formCollection = await Request.ReadFormAsync();

                if (formCollection == null)
                {
                    return BadRequest("formCollection is null");
                }

                if (formCollection.Files == null)
                {
                    return BadRequest("files collection is null");
                }

                var file = formCollection.Files.FirstOrDefault();

                if (file == null)
                {
                    return BadRequest("file is null");
                }
                
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, $"{DateTime.UtcNow.ToString("yyyyMMdd-HHmmssfff")}-{fileName}");
                    
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { fullPath });
                }
                else
                {
                    return BadRequest("file.Length is 0");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
    
    
}