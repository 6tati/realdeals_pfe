package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.Adresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Long> {
    List<Adresse> findByUtilisateur_IdUtilisateur(Long idUtilisateur);
}
