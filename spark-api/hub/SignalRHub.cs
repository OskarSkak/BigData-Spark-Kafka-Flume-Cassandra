using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace spark_api.hub
{
    public class SignalRHub :  Hub
    {
        public async Task SendMessage(String res)
            {
                await Clients.All.SendAsync("Analysis" , res);
            }
        
    }
}