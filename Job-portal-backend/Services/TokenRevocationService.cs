using System.Collections.Concurrent;

namespace Job_portal_backend.Services
{
    // Simple in-memory token revocation store. Use a persistent store for production.
    public class TokenRevocationService : ITokenRevocationService
    {
        private readonly ConcurrentDictionary<string, DateTimeOffset> _revoked = new();

        public void RevokeToken(string token, DateTimeOffset? expiry = null)
        {
            var until = expiry ?? DateTimeOffset.MaxValue;
            _revoked[token] = until;
        }

        public bool IsTokenRevoked(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;
            if (_revoked.TryGetValue(token, out var until))
            {
                if (DateTimeOffset.UtcNow <= until) return true;
                // expired entry - remove
                _revoked.TryRemove(token, out _);
                return false;
            }
            return false;
        }
    }
}
