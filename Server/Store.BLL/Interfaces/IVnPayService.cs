using Store.BLL.DTOs.Payment;
namespace Store.BLL.Interfaces;

public interface IVnPayService
{
    string CreatePaymentUrl(VnPayCreatePaymentRequest request);
    bool ValidateSignature(IReadOnlyDictionary<string, string> queryParams);
}