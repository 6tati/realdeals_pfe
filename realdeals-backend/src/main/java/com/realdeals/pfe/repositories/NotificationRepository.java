package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUtilisateur_IdUtilisateurOrderByDateCreationDesc(Long idUtilisateur);

    long countByUtilisateur_IdUtilisateurAndLuFalse(Long idUtilisateur);
}