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

import com.appdev.betaems.entity.Student;
import com.appdev.betaems.repository.StudentRepository;
import com.appdev.betaems.service.StudentService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public Optional<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Create student (legacy endpoint). If password provided, hash it.
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        if (student.getPassword() != null && !student.getPassword().isEmpty()) {
            student.setPassword(encoder.encode(student.getPassword()));
        }
        return studentService.saveStudent(student);
    }

    // Register endpoint for student (validates unique email)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {
        if (student.getEmail() == null || student.getPassword() == null) {
            Map<String, String> m = new HashMap<>();
            m.put("message", "Email and password required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            Map<String, String> m = new HashMap<>();
            m.put("message", "Email already registered");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        student.setPassword(encoder.encode(student.getPassword()));
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    // Login endpoint for student
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            Map<String, String> m = new HashMap<>();
            m.put("message", "Email and password required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(m);
        }
        Optional<Student> os = studentRepository.findByEmail(email);
        if (os.isEmpty()) {
            Map<String, String> m = new HashMap<>();
            m.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(m);
        }
        Student s = os.get();
        if (!encoder.matches(password, s.getPassword())) {
            Map<String, String> m = new HashMap<>();
            m.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(m);
        }
        return ResponseEntity.ok(s);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}