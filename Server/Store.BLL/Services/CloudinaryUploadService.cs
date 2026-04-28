using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Store.BLL.Configurations;
using Store.BLL.Interfaces;

namespace Store.BLL.Services;

public class CloudinaryUploadService : ICloudinaryUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryUploadService(IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        if (string.IsNullOrWhiteSpace(settings.CloudName) ||
            string.IsNullOrWhiteSpace(settings.ApiKey) ||
            string.IsNullOrWhiteSpace(settings.ApiSecret))
        {
            throw new InvalidOperationException("CloudinarySettings is missing required values.");
        }

        var account = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType, string folder)
    {
        if (fileStream is null || !fileStream.CanRead)
        {
            throw new ArgumentException("Image stream is invalid.");
        }

        if (string.IsNullOrWhiteSpace(contentType) || !contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Only image files are supported.");
        }

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = folder
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            throw new InvalidOperationException($"Image upload failed: {result.Error.Message}");
        }

        if (string.IsNullOrWhiteSpace(result.SecureUrl?.ToString()))
        {
            throw new InvalidOperationException("Cloudinary did not return image URL.");
        }

        return result.SecureUrl.ToString();
    }
}

