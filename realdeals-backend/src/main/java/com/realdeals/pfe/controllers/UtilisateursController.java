package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Utilisateurs;
import com.realdeals.pfe.repositories.UtilisateursRepository;
import com.realdeals.pfe.config.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateursController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUtilisateurs() {
        List<Utilisateurs> utilisateurs = utilisateursRepository.findAll();

        List<Map<String, Object>> result = utilisateurs.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("idUtilisateur", u.getIdUtilisateur());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("dateCreation", u.getDateCreation());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUtilisateurById(@PathVariable Long id) {
        Optional<Utilisateurs> utilisateur = utilisateursRepository.findById(id);

        if (utilisateur.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Utilisateurs u = utilisateur.get();

        Map<String, Object> map = new HashMap<>();
        map.put("idUtilisateur", u.getIdUtilisateur());
        map.put("name", u.getName());
        map.put("email", u.getEmail());
        map.put("role", u.getRole());
        map.put("dateCreation", u.getDateCreation());

        return ResponseEntity.ok(map);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUtilisateur(@RequestBody Utilisateurs utilisateur) {
        Optional<Utilisateurs> existing = utilisateursRepository.findByEmail(utilisateur.getEmail());

        if (existing.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        if (utilisateur.getRole() == null) {
            utilisateur.setRole(Utilisateurs.Role.CUSTOMER);
        }

        utilisateur.setPassword(utilisateur.getPassword());

        Utilisateurs saved = utilisateursRepository.save(utilisateur);

        Map<String, Object> map = new HashMap<>();
        map.put("idUtilisateur", saved.getIdUtilisateur());
        map.put("name", saved.getName());
        map.put("email", saved.getEmail());
        map.put("role", saved.getRole());
        map.put("dateCreation", saved.getDateCreation());

        return ResponseEntity.ok(map);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUtilisateur(@RequestBody LoginRequest request) {
        Optional<Utilisateurs> utilisateur = utilisateursRepository.findByEmail(request.getEmail());

        if (utilisateur.isPresent()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (encoder.matches(request.getPassword(), utilisateur.get().getPassword())) {
                String token = jwtService.generateToken(utilisateur.get());

                AuthResponse response = new AuthResponse(
                        token,
                        utilisateur.get().getIdUtilisateur(),
                        utilisateur.get().getName(),
                        utilisateur.get().getEmail(),
                        utilisateur.get().getRole().name()
                );

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateurs utilisateurDetails) {

        Optional<Utilisateurs> utilisateur = utilisateursRepository.findById(id);

        if (utilisateur.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Utilisateurs u = utilisateur.get();

        if (utilisateurDetails.getName() != null) {
            u.setName(utilisateurDetails.getName());
        }

        if (utilisateurDetails.getPassword() != null) {
            u.setPassword(utilisateurDetails.getPassword());
        }

        Utilisateurs updated = utilisateursRepository.save(u);

        Map<String, Object> map = new HashMap<>();
        map.put("idUtilisateur", updated.getIdUtilisateur());
        map.put("name", updated.getName());
        map.put("email", updated.getEmail());
        map.put("role", updated.getRole());
        map.put("dateCreation", updated.getDateCreation());

        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        if (utilisateursRepository.existsById(id)) {
            utilisateursRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    public static class LoginRequest {
        public String email;
        public String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }
    }

    public static class AuthResponse {
        private String token;
        private Long idUtilisateur;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, Long idUtilisateur, String name, String email, String role) {
            this.token = token;
            this.idUtilisateur = idUtilisateur;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public Long getIdUtilisateur() {
            return idUtilisateur;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}