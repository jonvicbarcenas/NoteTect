package com.appdevg4.krazyrapidboots.notetect.controller;

import com.appdevg4.krazyrapidboots.notetect.entity.User;
import com.appdevg4.krazyrapidboots.notetect.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    public static class SignupRequest { public String name; public String email; public String password; }
    public static class LoginRequest { public String email; public String password; }
    public static class AuthResponse { public Integer userId; public String name; public String email; }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest req) {
        User u = auth.signup(req.name, req.email, req.password);
        AuthResponse resp = new AuthResponse();
        resp.userId = u.getUserId(); resp.name = u.getName(); resp.email = u.getEmail();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        User u = auth.login(req.email, req.password);
        AuthResponse resp = new AuthResponse();
        resp.userId = u.getUserId(); resp.name = u.getName(); resp.email = u.getEmail();
        return ResponseEntity.ok(resp);
    }
}
