package com.appdevg4.krazyrapidboots.notetect.controller;

import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.service.AuthService;
import com.appdevg4.krazyrapidboots.notetect.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" }, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService auth, JwtUtil jwtUtil) {
        this.auth = auth;
        this.jwtUtil = jwtUtil;
    }

    public static class SignupRequest {
        public String name;
        public String email;
        public String password;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class AuthResponse {
        public Integer userId;
        public String name;
        public String email;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest req, HttpServletResponse response) {
        User u = auth.signup(req.name, req.email, req.password);

        // Generate JWT and set in HttpOnly cookie
        String token = jwtUtil.generateToken(u.getUserId());
        setJwtCookie(response, token);

        AuthResponse resp = new AuthResponse();
        resp.userId = u.getUserId();
        resp.name = u.getName();
        resp.email = u.getEmail();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        User u = auth.login(req.email, req.password);

        // Generate JWT and set in HttpOnly cookie
        String token = jwtUtil.generateToken(u.getUserId());
        setJwtCookie(response, token);

        AuthResponse resp = new AuthResponse();
        resp.userId = u.getUserId();
        resp.name = u.getName();
        resp.email = u.getEmail();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }

        Integer userId = (Integer) authentication.getPrincipal();
        User u = auth.getUserById(userId);

        AuthResponse resp = new AuthResponse();
        resp.userId = u.getUserId();
        resp.name = u.getName();
        resp.email = u.getEmail();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        clearJwtCookie(response);
        return ResponseEntity.ok().build();
    }

    private void setJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        // cookie.setSecure(true); // Enable in production with HTTPS
        response.addCookie(cookie);
    }

    private void clearJwtCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
