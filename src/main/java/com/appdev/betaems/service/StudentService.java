package com.appdev.betaems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.betaems.entity.Student;
import com.appdev.betaems.repository.StudentRepository;


@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            // Only update fields that are explicitly provided (non-null)
            if (studentDetails.getFirstname() != null) {
                student.setFirstname(studentDetails.getFirstname());
            }
            if (studentDetails.getLastname() != null) {
                student.setLastname(studentDetails.getLastname());
            }
            if (studentDetails.getEmail() != null) {
                student.setEmail(studentDetails.getEmail());
            }
            if (studentDetails.getPhone() != null) {
                student.setPhone(studentDetails.getPhone());
            }
            if (studentDetails.getDateOfBirth() != null) {
                student.setDateOfBirth(studentDetails.getDateOfBirth());
            }
            if (studentDetails.getAddress() != null) {
                student.setAddress(studentDetails.getAddress());
            }
            if (studentDetails.getProgram() != null) {
                student.setProgram(studentDetails.getProgram());
            }
            return studentRepository.save(student);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}