package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Produits;
import com.realdeals.pfe.repositories.ProduitsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produits")
public class ProduitsController {

    @Autowired
    private ProduitsRepository produitsRepository;

    // GET all products
    @GetMapping
    public ResponseEntity<List<Produits>> getAllProduits() {
        List<Produits> produits = produitsRepository.findAll();
        return ResponseEntity.ok(produits);
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Produits> getProduitById(@PathVariable Long id) {
        Optional<Produits> produit = produitsRepository.findById(id);
        return produit.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET products by category
    @GetMapping("/categorie/{idCateg}")
    public ResponseEntity<List<Produits>> getProduitsByCategorie(@PathVariable Long idCateg) {
        List<Produits> produits = produitsRepository.findByCategorie_IdCateg(idCateg);
        return ResponseEntity.ok(produits);
    }

    // SEARCH products by name
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Produits>> searchProduits(@PathVariable String name) {
        List<Produits> produits = produitsRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(produits);
    }

    // POST create product (ADMIN only)
    @PostMapping
    public ResponseEntity<Produits> createProduit(@RequestBody Produits produit) {
        Produits saved = produitsRepository.save(produit);
        return ResponseEntity.ok(saved);
    }

    // PUT update product
    @PutMapping("/{id}")
    public ResponseEntity<Produits> updateProduit(@PathVariable Long id, @RequestBody Produits produitDetails) {
        Optional<Produits> produit = produitsRepository.findById(id);
        if (produit.isPresent()) {
            Produits p = produit.get();
            if (produitDetails.getName() != null) p.setName(produitDetails.getName());
            if (produitDetails.getDescription() != null) p.setDescription(produitDetails.getDescription());
            if (produitDetails.getDescriptionSeo() != null) p.setDescriptionSeo(produitDetails.getDescriptionSeo());
            if (produitDetails.getPrix() != null) p.setPrix(produitDetails.getPrix());
            if (produitDetails.getStock() != null) p.setStock(produitDetails.getStock());
            if (produitDetails.getTailles() != null) p.setTailles(produitDetails.getTailles());
            if (produitDetails.getImageUrl() != null) p.setImageUrl(produitDetails.getImageUrl());
            if (produitDetails.getImageUrls() != null) p.setImageUrls(produitDetails.getImageUrls());
            if (produitDetails.getCategorie() != null) p.setCategorie(produitDetails.getCategorie());
            Produits updated = produitsRepository.save(p);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }



    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        if (produitsRepository.existsById(id)) {
            produitsRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
