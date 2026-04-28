namespace Store.BLL.Interfaces;

public interface ICloudinaryUploadService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType, string folder);
}

