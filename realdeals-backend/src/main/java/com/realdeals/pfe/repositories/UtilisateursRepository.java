package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateursRepository extends JpaRepository<Utilisateurs, Long> {
    Optional<Utilisateurs> findByEmail(String email);
}
