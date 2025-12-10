package com.appdev.betaems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.betaems.entity.User;
import com.appdev.betaems.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Only update fields that are explicitly provided (non-null)
            if (userDetails.getFirstname() != null) {
                user.setFirstname(userDetails.getFirstname());
            }
            if (userDetails.getLastname() != null) {
                user.setLastname(userDetails.getLastname());
            }
            if (userDetails.getRole() != null) {
                user.setRole(userDetails.getRole());
            }
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }
            if (userDetails.getPhone() != null) {
                user.setPhone(userDetails.getPhone());
            }
            if (userDetails.getDepartment() != null) {
                user.setDepartment(userDetails.getDepartment());
            }
            if (userDetails.getOfficeLocation() != null) {
                user.setOfficeLocation(userDetails.getOfficeLocation());
            }
            if (userDetails.getOfficeHours() != null) {
                user.setOfficeHours(userDetails.getOfficeHours());
            }
            if (userDetails.getCurrentSemester() != null) {
                user.setCurrentSemester(userDetails.getCurrentSemester());
            }
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}