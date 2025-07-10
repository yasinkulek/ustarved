using System.ComponentModel.DataAnnotations;

namespace uStarved.API.Models
{
    public class RecipeCreateModel
    {
        [Required] 
        public string Title { get; set; } = string.Empty;
        
        [Required] 
        public string Description { get; set; } = string.Empty;
        
        [Required] 
        public string Ingredients { get; set; } = string.Empty;
        
        [Required] 
        public string Instructions { get; set; } = string.Empty;
        
        [Required] 
        public int CookingTime { get; set; }
        
        [Required] 
        public int Servings { get; set; }
        
        public string? ImageUrl { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class RecipeUpdateModel
    {
        [Required] 
        public string Title { get; set; } = string.Empty;
        
        [Required] 
        public string Description { get; set; } = string.Empty;
        
        [Required] 
        public string Ingredients { get; set; } = string.Empty;
        
        [Required] 
        public string Instructions { get; set; } = string.Empty;
        
        [Required] 
        public int CookingTime { get; set; }
        
        [Required] 
        public int Servings { get; set; }
        
        public string? ImageUrl { get; set; }
    }
} 