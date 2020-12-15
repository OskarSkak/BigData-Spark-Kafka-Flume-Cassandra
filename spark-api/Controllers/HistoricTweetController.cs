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
        public async Task<IActionResult> Get([FromQuery]  int from , int to)
        {
            if (from == null && to == null)
            {
                var resAll = await _cassandraService.GetAll();
                return Ok(resAll);
            }
            
            var res = await _cassandraService.GetAllBetween( from , to);
            return Ok(res);
        }

    }
}