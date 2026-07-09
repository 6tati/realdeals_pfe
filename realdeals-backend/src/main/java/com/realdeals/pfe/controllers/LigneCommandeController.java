package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.LigneCommande;
import com.realdeals.pfe.repositories.LigneCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lignecommande")
@CrossOrigin(origins = "*")
public class LigneCommandeController {

    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    // GET all line items
    @GetMapping
    public ResponseEntity<List<LigneCommande>> getAllLigneCommande() {
        List<LigneCommande> items = ligneCommandeRepository.findAll();
        return ResponseEntity.ok(items);
    }

    // GET line item by ID
    @GetMapping("/{id}")
    public ResponseEntity<LigneCommande> getLigneCommandeById(@PathVariable Long id) {
        Optional<LigneCommande> item = ligneCommandeRepository.findById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET line items by order ID
    @GetMapping("/order/{idOrder}")
    public ResponseEntity<List<LigneCommande>> getLigneCommandeByOrder(@PathVariable Long idOrder) {
        List<LigneCommande> items = ligneCommandeRepository.findByOrder_IdOrder(idOrder);
        return ResponseEntity.ok(items);
    }

    // POST create line item
    @PostMapping
    public ResponseEntity<LigneCommande> createLigneCommande(@RequestBody LigneCommande item) {
        LigneCommande saved = ligneCommandeRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    // PUT update line item
    @PutMapping("/{id}")
    public ResponseEntity<LigneCommande> updateLigneCommande(@PathVariable Long id, @RequestBody LigneCommande itemDetails) {
        Optional<LigneCommande> item = ligneCommandeRepository.findById(id);
        if (item.isPresent()) {
            LigneCommande lc = item.get();
            if (itemDetails.getQuantite() != null) lc.setQuantite(itemDetails.getQuantite());
            if (itemDetails.getPrixUnitaire() != null) lc.setPrixUnitaire(itemDetails.getPrixUnitaire());
            LigneCommande updated = ligneCommandeRepository.save(lc);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE line item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigneCommande(@PathVariable Long id) {
        if (ligneCommandeRepository.existsById(id)) {
            ligneCommandeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
