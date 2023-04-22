using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;
using MVP1.Models;

var builder = WebApplication.CreateBuilder(args);

//configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<MyStoreContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyStore")));


var app = builder.Build();




// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}



app.UseHttpsRedirection();
app.UseStaticFiles();

// Add the UseCors middleware here, between UseRouting and UseEndpoints.
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());

app.UseRouting();




app.UseDeveloperExceptionPage();
//To get more information about the error




app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
   app.MapFallbackToFile("index.html"); ;
//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllers();
//    endpoints.MapControllerRoute(
//        name: "default",
//        pattern: "{controller=Home}/{action=Index}/{id?}");
//    endpoints.MapControllerRoute(
//        name: "api",
//        pattern: "api/{controller}/{action}/{id?}");
//});


app.Run();
