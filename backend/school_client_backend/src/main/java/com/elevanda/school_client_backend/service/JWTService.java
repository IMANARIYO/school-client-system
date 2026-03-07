package com.elevanda.school_client_backend.service;

import com.elevanda.school_client_backend.model.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

    // ==================== CONFIGURATION ====================
    // Secret key used to sign JWT tokens.
    // IMPORTANT: Must be at least 256 bits long for HS256
    // TODO: Move to application.properties or environment variable in production
    private static final String SECRET_KEY = "s3cr3tKeyForJWTGenerationThatIsAtLeast256BitsLong!";

    // Access token expiration time: 1 hour (short-lived token)
    private static final long ACCESS_TOKEN_EXPIRATION_MS = 1000 * 60 * 60;

    // Refresh token expiration time: 7 days (long-lived token)
    private static final long REFRESH_TOKEN_EXPIRATION_MS = 1000L * 60 * 60 * 24 * 7;

    // ==================== SIGNING KEY ====================
    /**
     * Convert the secret key string into a SecretKey object for signing JWTs.
     * @return SecretKey used to sign JWT tokens
     */
    private SecretKey getSignInKey() {
        // Decode base64 secret to bytes
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        // Generate HMAC-SHA256 key
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ==================== TOKEN GENERATION ====================
    /**
     * Generate an access token for a user.
     * @param userDetails authenticated user
     * @return JWT access token string
     */
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, ACCESS_TOKEN_EXPIRATION_MS);
    }

    /**
     * Generate a refresh token for a user.
     * @param userDetails authenticated user
     * @return JWT refresh token string
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, REFRESH_TOKEN_EXPIRATION_MS);
    }

    /**
     * Generate a JWT token with claims and expiration.
     * @param userDetails authenticated user
     * @param expirationMs token lifetime in milliseconds
     * @return signed JWT string
     */
    private String generateToken(UserDetails userDetails, long expirationMs) {
        Map<String, Object> claims = new HashMap<>();

        // Add custom claims if userDetails is our custom UserPrincipal
        if (userDetails instanceof UserPrincipal principal) {
            claims.put("userId", principal.getUser().getId().toString());
            claims.put("role", principal.getUser().getRole().name());
            claims.put("fullName", principal.getUser().getFirstName()+principal.getUser().getLastName());
            claims.put("email", principal.getUser().getEmail());
            claims.put("permissions", principal.getAuthorities()); // Spring authorities
            claims.put("issuedBy", "InventorySystem"); // Optional metadata
        }

        // Set issued and expiration time
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        // Build and sign JWT
        return Jwts.builder()
                .claims(claims)                // Custom claims
                .subject(userDetails.getUsername()) // Subject: username/email
                .issuedAt(now)                  // Token creation time
                .expiration(expiryDate)         // Expiration
                .signWith(getSignInKey())       // Sign with HMAC key
                .compact();
    }

    // ==================== TOKEN VALIDATION ====================
    /**
     * Check if an access token is valid for a user
     */
    public boolean isAccessTokenValid(String token, UserDetails userDetails) {
        return isTokenValid(token, userDetails, false);
    }

    /**
     * Check if a refresh token is valid for a user
     */
    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        return isTokenValid(token, userDetails, true);
    }

    /**
     * Validate token: email matches, token not expired
     * @param token JWT string
     * @param userDetails user object
     * @param isRefresh true if validating refresh token
     * @return true if valid
     */
    private boolean isTokenValid(String token, UserDetails userDetails, boolean isRefresh) {
        String email = extractEmailAllowExpired(token);

        // Check if token belongs to this user
        if (!email.equals(userDetails.getUsername())) {
            throw new RuntimeException("Token email does not match user");
        }

        // Check expiration depending on token type
        if (!isRefresh && isTokenExpired(token)) {
            throw new RuntimeException("Access token has expired");
        }
        if (isRefresh && isRefreshTokenExpired(token)) {
            throw new RuntimeException("Refresh token has expired");
        }

        return true;
    }

    // ==================== CLAIMS EXTRACTION ====================
    /**
     * Extract email/username from a token
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract email even from expired token (used for refresh workflow)
     */
    public String extractEmailAllowExpired(String token) {
        return extractAllClaimsAllowExpired(token).getSubject();
    }

    /**
     * Extract expiration date from token
     */
    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // ==================== EXPIRATION CHECK ====================
    /**
     * Check if access token has expired
     */
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Check if refresh token has expired
     */
    public boolean isRefreshTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ==================== CLAIMS PARSING ====================
    /**
     * Parse JWT and get claims
     * @throws RuntimeException if token invalid or expired
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token has expired");
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JWT claims");
        }
    }

    /**
     * Parse JWT and get claims even if token expired
     */
    private Claims extractAllClaimsAllowExpired(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            // Return claims even if token expired (used for refresh workflow)
            return e.getClaims();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JWT claims");
        }
    }
}
