package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Categories;
import com.realdeals.pfe.repositories.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    @Autowired
    private CategoriesRepository categoriesRepository;

    // GET all categories
    @GetMapping
    public ResponseEntity<List<Categories>> getAllCategories() {
        List<Categories> categories = categoriesRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Categories> getCategoryById(@PathVariable Long id) {
        Optional<Categories> category = categoriesRepository.findById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST create category (ADMIN only)
    @PostMapping
    public ResponseEntity<Categories> createCategory(@RequestBody Categories category) {
        Categories saved = categoriesRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    // PUT update category
    @PutMapping("/{id}")
    public ResponseEntity<Categories> updateCategory(@PathVariable Long id, @RequestBody Categories categoryDetails) {
        Optional<Categories> category = categoriesRepository.findById(id);
        if (category.isPresent()) {
            Categories c = category.get();
            if (categoryDetails.getName() != null) c.setName(categoryDetails.getName());
            Categories updated = categoriesRepository.save(c);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (categoriesRepository.existsById(id)) {
            categoriesRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
