package com.fpt.hhtlmilkteaapi.security.jwt;

import com.fpt.hhtlmilkteaapi.security.service.CustomizeUser;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtils.class);
    private static final ConcurrentHashMap<String, String> userTokenMap = new ConcurrentHashMap<>();

    @Value("${javadocfast.app.jwtSecret}")
    private String jwtSecret;

    @Value("${javadocfast.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        CustomizeUser userPrincipal = (CustomizeUser) authentication.getPrincipal();
        String username = userPrincipal.getUsername();
        
        // Invalidate old token if exists
        String oldToken = userTokenMap.get(username);
        if (oldToken != null) {
            userTokenMap.remove(username);
            LOGGER.info("Invalidated old token for user: {}", username);
        }

        String newToken = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // Store new token
        userTokenMap.put(username, newToken);
        LOGGER.info("Generated new token for user: {}", username);
        return newToken;
    }

    public String getUsernameFromJwtToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            LOGGER.error("Error getting username from token: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateJwtToken(String authToken) {
        if (authToken == null) {
            LOGGER.error("Token is null");
            return false;
        }

        try {
            // First validate the token structure
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            
            // Then check if it's the current valid token for the user
            String username = getUsernameFromJwtToken(authToken);
            if (username == null) {
                LOGGER.error("Username is null");
                return false;
            }

            String storedToken = userTokenMap.get(username);
            if (storedToken == null) {
                LOGGER.error("No stored token found for user: {}", username);
                return false;
            }

            if (!storedToken.equals(authToken)) {
                LOGGER.error("Token mismatch for user: {}", username);
                return false;
            }

            return true;
        } catch (SignatureException e) {
            LOGGER.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            LOGGER.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            LOGGER.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            LOGGER.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            LOGGER.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }

    public void invalidateToken(String token) {
        if (token != null) {
            try {
                String username = getUsernameFromJwtToken(token);
                if (username != null) {
                    userTokenMap.remove(username);
                    LOGGER.info("Invalidated token for user: {}", username);
                }
            } catch (Exception e) {
                LOGGER.error("Error invalidating token: {}", e.getMessage());
            }
        }
    }
}
