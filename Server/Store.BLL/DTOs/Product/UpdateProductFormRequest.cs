using Microsoft.AspNetCore.Http;
using Store.BLL.DTOs.Product;

namespace Store.BLL.DTOs.Product;

public class UpdateProductFormRequest : UpdateProductRequest
{
    public IFormFile? ImageFile { get; set; }
}

