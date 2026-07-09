package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.Produits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitsRepository extends JpaRepository<Produits, Long> {
    List<Produits> findByCategorie_IdCateg(Long idCateg);
    List<Produits> findByNameContainingIgnoreCase(String name);
}
