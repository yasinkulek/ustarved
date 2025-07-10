using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using uStarved.API.Data;
using uStarved.API.Models;

namespace uStarved.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecipesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRecipes()
        {
            var recipes = await _context.Recipes
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.Ingredients,
                    r.Instructions,
                    r.CookingTime,
                    r.Servings,
                    r.ImageUrl,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.Email
                    }
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound();

            return Ok(new
            {
                recipe.Id,
                recipe.Title,
                recipe.Description,
                recipe.Ingredients,
                recipe.Instructions,
                recipe.CookingTime,
                recipe.Servings,
                recipe.ImageUrl,
                recipe.CreatedAt,
                User = new
                {
                    recipe.User.Id,
                    recipe.User.Email
                }
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromBody] RecipeCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Geçersiz veri formatı",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                var recipe = new Recipe
                {
                    Title = model.Title,
                    Description = model.Description,
                    Ingredients = model.Ingredients,
                    Instructions = model.Instructions,
                    CookingTime = model.CookingTime,
                    Servings = model.Servings,
                    ImageUrl = model.ImageUrl,
                    UserId = model.UserId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, new
                {
                    recipe.Id,
                    recipe.Title,
                    recipe.Description,
                    recipe.Ingredients,
                    recipe.Instructions,
                    recipe.CookingTime,
                    recipe.Servings,
                    recipe.ImageUrl,
                    recipe.CreatedAt,
                    recipe.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tarif oluşturulurken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] RecipeUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Geçersiz veri formatı",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                var recipe = await _context.Recipes.FindAsync(id);
                if (recipe == null)
                    return NotFound(new { message = "Tarif bulunamadı" });

                recipe.Title = model.Title;
                recipe.Description = model.Description;
                recipe.Ingredients = model.Ingredients;
                recipe.Instructions = model.Instructions;
                recipe.CookingTime = model.CookingTime;
                recipe.Servings = model.Servings;
                recipe.ImageUrl = model.ImageUrl;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    recipe.Id,
                    recipe.Title,
                    recipe.Description,
                    recipe.Ingredients,
                    recipe.Instructions,
                    recipe.CookingTime,
                    recipe.Servings,
                    recipe.ImageUrl,
                    recipe.CreatedAt,
                    recipe.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tarif güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            try
            {
                var recipe = await _context.Recipes.FindAsync(id);
                if (recipe == null)
                    return NotFound(new { message = "Tarif bulunamadı" });

                _context.Recipes.Remove(recipe);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tarif başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Tarif silinirken bir hata oluştu", error = ex.Message });
            }
        }
    }
}
