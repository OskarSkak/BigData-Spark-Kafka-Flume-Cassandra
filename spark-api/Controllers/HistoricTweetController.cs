using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace spark_api.Controllers
{
    [ApiController]
    [Route("api/historictweets")]
    public class HistoricTweetController : ControllerBase
    {
        private readonly ICassandraService _cassandraService;

        public HistoricTweetController(ICassandraService cassandraService)
        {
            _cassandraService = cassandraService;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]  int from , int to, string type)
        {
            if (type == "newscorrelated")
            {
                var resNews = await _cassandraService.GetAllBetweenNews( from , to); 
                return Ok(resNews);
            }
            else 
            {
                var resCorona = await _cassandraService.GetAllBetweenCorona( from , to);
                return Ok(resCorona);
            }

           
        }

    }
}