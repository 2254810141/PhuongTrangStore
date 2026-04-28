using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Store.BLL.DTOs.Payment;
using Store.BLL.Interfaces;

namespace Store.BLL.Services;

public class VnPayService : IVnPayService
{
    private readonly string _tmnCode;
    private readonly string _hashSecret;
    private readonly string _baseUrl;

    public VnPayService(IConfiguration configuration)
    {
        var section = configuration.GetSection("VnPay");

        _tmnCode = section["TmnCode"] ?? throw new InvalidOperationException("VnPay:TmnCode is missing.");
        _hashSecret = section["HashSecret"] ?? throw new InvalidOperationException("VnPay:HashSecret is missing.");
        _baseUrl = section["BaseUrl"] ?? throw new InvalidOperationException("VnPay:BaseUrl is missing.");
    }

    public string CreatePaymentUrl(VnPayCreatePaymentRequest request)
    {
        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = _tmnCode,
            ["vnp_Amount"] = ((long)(request.Amount * 100m)).ToString(CultureInfo.InvariantCulture),
            ["vnp_CurrCode"] = "VND",
            ["vnp_TxnRef"] = request.OrderId.ToString(CultureInfo.InvariantCulture),
            ["vnp_OrderInfo"] = request.OrderInfo,
            ["vnp_OrderType"] = "other",
            ["vnp_Locale"] = "vn",
            ["vnp_ReturnUrl"] = request.ReturnUrl,
            ["vnp_IpAddr"] = string.IsNullOrWhiteSpace(request.ClientIp) ? "127.0.0.1" : request.ClientIp,
            ["vnp_CreateDate"] = request.CreatedAt.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture),
            ["vnp_ExpireDate"] = request.ExpireAt.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture)
        };

        var signData = BuildQueryString(vnpParams);
        var secureHash = HmacSha512(_hashSecret, signData);

        return $"{_baseUrl}?{signData}&vnp_SecureHash={secureHash}";
    }

    public bool ValidateSignature(IReadOnlyDictionary<string, string> queryParams)
    {
        if (!queryParams.TryGetValue("vnp_SecureHash", out var receivedHash) || string.IsNullOrWhiteSpace(receivedHash))
            return false;

        var filteredParams = queryParams
            .Where(x => !string.Equals(x.Key, "vnp_SecureHash", StringComparison.OrdinalIgnoreCase)
                     && !string.Equals(x.Key, "vnp_SecureHashType", StringComparison.OrdinalIgnoreCase))
            .OrderBy(x => x.Key, StringComparer.Ordinal)
            .ToDictionary(x => x.Key, x => x.Value, StringComparer.Ordinal);

        var signData = BuildQueryString(filteredParams);
        var expectedHash = HmacSha512(_hashSecret, signData);

        return string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string BuildQueryString(IReadOnlyDictionary<string, string> data)
    {
        return string.Join("&", data
            .Where(x => !string.IsNullOrWhiteSpace(x.Value))
            .OrderBy(x => x.Key, StringComparer.Ordinal)
            .Select(x => $"{x.Key}={WebUtility.UrlEncode(x.Value)}"));
    }

    private static string HmacSha512(string key, string inputData)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(inputData));
        return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
    }
}
