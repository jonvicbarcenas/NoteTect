package com.appdev.notetect.backend.repository;

import com.appdev.notetect.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // Optional: find user by email for login
    UserEntity findByEmail(String email);
}
