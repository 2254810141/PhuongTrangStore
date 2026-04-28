using Microsoft.AspNetCore.Http;
using Store.BLL.DTOs.Product;

namespace Store.BLL.DTOs.Product;

public class CreateProductFormRequest : CreateProductRequest
{
    public IFormFile? ImageFile { get; set; }
}

