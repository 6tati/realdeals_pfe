package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Adresse;
import com.realdeals.pfe.repositories.AdresseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adresses")
@CrossOrigin(origins = "*")
public class AdresseController {

    @Autowired
    private AdresseRepository adresseRepository;

    // GET all addresses
    @GetMapping
    public ResponseEntity<List<Adresse>> getAllAdresses() {
        List<Adresse> adresses = adresseRepository.findAll();
        return ResponseEntity.ok(adresses);
    }

    // GET address by ID
    @GetMapping("/{id}")
    public ResponseEntity<Adresse> getAdresseById(@PathVariable Long id) {
        Optional<Adresse> adresse = adresseRepository.findById(id);
        return adresse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET addresses by user ID
    @GetMapping("/user/{idUtilisateur}")
    public ResponseEntity<List<Adresse>> getAdressesByUser(@PathVariable Long idUtilisateur) {
        List<Adresse> adresses = adresseRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
        return ResponseEntity.ok(adresses);
    }

    // POST create address
    @PostMapping
    public ResponseEntity<Adresse> createAdresse(@RequestBody Adresse adresse) {
        Adresse saved = adresseRepository.save(adresse);
        return ResponseEntity.ok(saved);
    }

    // PUT update address
    @PutMapping("/{id}")
    public ResponseEntity<Adresse> updateAdresse(@PathVariable Long id, @RequestBody Adresse adresseDetails) {
        Optional<Adresse> adresse = adresseRepository.findById(id);
        if (adresse.isPresent()) {
            Adresse a = adresse.get();
            if (adresseDetails.getVille() != null) a.setVille(adresseDetails.getVille());
            if (adresseDetails.getRue() != null) a.setRue(adresseDetails.getRue());
            if (adresseDetails.getCodePostal() != null) a.setCodePostal(adresseDetails.getCodePostal());
            Adresse updated = adresseRepository.save(a);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE address
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdresse(@PathVariable Long id) {
        if (adresseRepository.existsById(id)) {
            adresseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
