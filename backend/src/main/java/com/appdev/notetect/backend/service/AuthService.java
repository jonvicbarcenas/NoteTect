package com.appdev.notetect.backend.service;

import com.appdev.notetect.backend.dto.AuthResponse;
import com.appdev.notetect.backend.dto.LoginRequest;
import com.appdev.notetect.backend.dto.SignupRequest;
import com.appdev.notetect.backend.entity.User;
import com.appdev.notetect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, "Email already exists");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, null, null, "Username already exists");
        }
        
        // Create new user
        User user = new User(
            request.getUsername(),
            request.getEmail(),
            request.getPassword() // Note: In production, hash the password using BCrypt
        );
        
        User savedUser = userRepository.save(user);
        
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            "User registered successfully"
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Check password (Note: In production, use BCrypt to compare hashed passwords)
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(null, null, null, "Invalid email or password");
        }
        
        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            "Login successful"
        );
    }
}
