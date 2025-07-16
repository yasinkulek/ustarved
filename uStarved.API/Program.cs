using Microsoft.EntityFrameworkCore;
using uStarved.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGithubPages",
        builder =>
        {
            builder.WithOrigins("https://yasinkulek.github.io")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Her isteği loglayan middleware
app.Use(async (context, next) =>
{
    Console.WriteLine($"[LOG] {DateTime.Now}: {context.Request.Method} {context.Request.Path}");
    await next();
});

// Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (error != null)
        {
            var err = new { message = error.Error.Message, stackTrace = error.Error.StackTrace };
            Console.WriteLine($"[ERROR] {DateTime.Now}: {error.Error.Message}");
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(err));
        }
    });
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS'u UseRouting'den önce ekleyelim
app.UseCors("AllowGithubPages");

app.UseAuthorization();
app.MapControllers();

// Test endpoint'i
app.MapGet("/test", () => "API is working!");

// Veritabanı migration'larını otomatik çalıştır
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        context.Database.Migrate();
        Console.WriteLine("Database migration completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration failed: {ex.Message}");
    }
}

app.Run();