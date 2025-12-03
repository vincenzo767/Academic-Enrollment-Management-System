package com.appdev.betaems.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.betaems.entity.User;
import com.appdev.betaems.repository.UserRepository;
import com.appdev.betaems.service.UserService;


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Legacy create (keeps existing behavior) but does not perform password hashing
    @PostMapping
    public User createUser(@RequestBody User user) {
        // If password present, hash it before saving
        if(user.getPassword() != null && !user.getPassword().isEmpty()){
            user.setPassword(encoder.encode(user.getPassword()));
        }
        return userService.saveUser(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){
        if(user.getEmail() == null || user.getPassword() == null) {
            Map<String,String> m = new HashMap<>(); m.put("message","Email and password required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            Map<String,String> m = new HashMap<>(); m.put("message","Email already registered");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        user.setPassword(encoder.encode(user.getPassword()));
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String email = body.get("email");
        String password = body.get("password");
        if(email == null || password == null){
            Map<String,String> m = new HashMap<>(); m.put("message","Email and password required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        Optional<User> ou = userRepository.findByEmail(email);
        if(ou.isEmpty()){
            Map<String,String> m = new HashMap<>(); m.put("message","Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(m);
        }
        User u = ou.get();
        if(!encoder.matches(password, u.getPassword())){
            Map<String,String> m = new HashMap<>(); m.put("message","Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(m);
        }
        return ResponseEntity.ok(u);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}