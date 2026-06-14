namespace Job_portal_backend.Services
{
    public interface ITokenRevocationService
    {
        void RevokeToken(string token, System.DateTimeOffset? expiry = null);
        bool IsTokenRevoked(string token);
    }
}
